'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

// Configuration
const AUTH_CONFIG = {
    JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString('hex'),
    JWT_EXPIRY: process.env.JWT_EXPIRY || '15m', // Access token expiry
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d', // Refresh token expiry
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    PASSWORD_MIN_LENGTH: 8,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_TIME: 30 * 60 * 1000, // 30 minutes
};

// In-memory user store (replace with database in production)
const userStore = new Map();
const refreshTokenStore = new Map();
const loginAttempts = new Map();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true,
});

// Password validation utility
function validatePassword(password) {
    const minLength = AUTH_CONFIG.PASSWORD_MIN_LENGTH;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// Generate secure tokens
function generateTokens(userId, role, email, deviceInfo = null) {
    const payload = {
        userId,
        role,
        email,
        deviceInfo,
        type: 'access'
    };

    const refreshPayload = {
        userId,
        type: 'refresh',
        tokenId: crypto.randomBytes(16).toString('hex')
    };

    const accessToken = jwt.sign(payload, AUTH_CONFIG.JWT_SECRET, {
        expiresIn: AUTH_CONFIG.JWT_EXPIRY,
        issuer: 'ayurveda-supply-chain',
        audience: 'ayurveda-users'
    });

    const refreshToken = jwt.sign(refreshPayload, AUTH_CONFIG.JWT_REFRESH_SECRET, {
        expiresIn: AUTH_CONFIG.JWT_REFRESH_EXPIRY,
        issuer: 'ayurveda-supply-chain',
        audience: 'ayurveda-users'
    });

    // Store refresh token
    refreshTokenStore.set(refreshPayload.tokenId, {
        userId,
        token: refreshToken,
        createdAt: new Date(),
        deviceInfo
    });

    return { accessToken, refreshToken };
}

// Verify JWT middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
        
        if (decoded.type !== 'access') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token type'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Token verification failed'
        });
    }
}

// Role-based access control middleware
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
}

// Check login attempts and lockout
function checkLoginAttempts(identifier) {
    const attempts = loginAttempts.get(identifier);
    if (!attempts) return { allowed: true };

    if (attempts.count >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
        const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
        if (timeSinceLastAttempt < AUTH_CONFIG.LOCKOUT_TIME) {
            return {
                allowed: false,
                remainingTime: AUTH_CONFIG.LOCKOUT_TIME - timeSinceLastAttempt
            };
        } else {
            // Reset attempts after lockout period
            loginAttempts.delete(identifier);
            return { allowed: true };
        }
    }

    return { allowed: true };
}

// Record login attempt
function recordLoginAttempt(identifier, success) {
    const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: 0 };
    
    if (success) {
        loginAttempts.delete(identifier);
    } else {
        attempts.count++;
        attempts.lastAttempt = Date.now();
        loginAttempts.set(identifier, attempts);
    }
}

// Enhanced registration function
async function registerUser(userData, fabricHelper) {
    try {
        const {
            email,
            password,
            confirmPassword,
            userType, // 'farmer', 'manufacturer', 'laboratory'
            deviceInfo,
            // User-specific data based on type
            ...userSpecificData
        } = userData;

        // Basic validation
        if (!email || !password || !userType) {
            throw new Error('Email, password, and user type are required');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            throw new Error(`Password requirements not met: ${passwordValidation.errors.join(', ')}`);
        }

        // Check if user already exists
        const existingUser = Array.from(userStore.values()).find(user => user.email === email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Generate unique userId
        const userId = `${userType}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        // Hash password
        const passwordHash = await bcrypt.hash(password, AUTH_CONFIG.BCRYPT_ROUNDS);

        // Determine admin ID based on user type and organization
        let adminId, orgId;
        switch (userType) {
            case 'farmer':
            case 'manufacturer':
                adminId = 'regulatorAdmin';
                orgId = 'Org1';
                break;
            case 'laboratory':
                adminId = 'labAdmin';
                orgId = 'Org2';
                break;
            default:
                throw new Error('Invalid user type');
        }

        // Register user in Hyperledger Fabric
        const fabricResult = await fabricHelper.registerAndOnboardUser(
            adminId,
            userId,
            userType,
            userSpecificData,
            orgId
        );

        if (fabricResult.statusCode !== 200) {
            throw new Error(`Fabric registration failed: ${fabricResult.message}`);
        }

        // Store user data
        const user = {
            userId,
            email,
            passwordHash,
            role: userType,
            createdAt: new Date(),
            isActive: true,
            emailVerified: false, // In production, implement email verification
            profile: userSpecificData,
            lastLogin: null,
            deviceInfo: deviceInfo || null
        };

        userStore.set(userId, user);

        // Generate tokens
        const tokens = generateTokens(userId, userType, email, deviceInfo);

        return {
            success: true,
            statusCode: 200,
            message: 'User registered successfully',
            data: {
                userId,
                email,
                role: userType,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                fabricRegistration: fabricResult
            }
        };

    } catch (error) {
        console.error('Registration error:', error.message);
        return {
            success: false,
            statusCode: 400,
            message: error.message
        };
    }
}

// Enhanced login function
async function loginUser(credentials) {
    try {
        const { email, password, deviceInfo } = credentials;

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Check login attempts
        const attemptsCheck = checkLoginAttempts(email);
        if (!attemptsCheck.allowed) {
            const remainingMinutes = Math.ceil(attemptsCheck.remainingTime / (60 * 1000));
            throw new Error(`Account locked. Try again in ${remainingMinutes} minutes`);
        }

        // Find user
        const user = Array.from(userStore.values()).find(u => u.email === email);
        if (!user) {
            recordLoginAttempt(email, false);
            throw new Error('Invalid credentials');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        // Verify password
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            recordLoginAttempt(email, false);
            throw new Error('Invalid credentials');
        }

        // Update last login
        user.lastLogin = new Date();
        user.deviceInfo = deviceInfo || user.deviceInfo;

        // Generate tokens
        const tokens = generateTokens(user.userId, user.role, user.email, deviceInfo);

        // Record successful login
        recordLoginAttempt(email, true);

        return {
            success: true,
            statusCode: 200,
            message: 'Login successful',
            data: {
                userId: user.userId,
                email: user.email,
                role: user.role,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                profile: user.profile
            }
        };

    } catch (error) {
        return {
            success: false,
            statusCode: 401,
            message: error.message
        };
    }
}

// Refresh token function
async function refreshToken(refreshTokenValue) {
    try {
        if (!refreshTokenValue) {
            throw new Error('Refresh token required');
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshTokenValue, AUTH_CONFIG.JWT_REFRESH_SECRET);
        
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        // Check if refresh token exists in store
        const tokenData = refreshTokenStore.get(decoded.tokenId);
        if (!tokenData || tokenData.token !== refreshTokenValue) {
            throw new Error('Invalid refresh token');
        }

        // Get user data
        const user = userStore.get(tokenData.userId);
        if (!user || !user.isActive) {
            throw new Error('User not found or inactive');
        }

        // Generate new tokens
        const tokens = generateTokens(user.userId, user.role, user.email, tokenData.deviceInfo);

        // Remove old refresh token and store new one
        refreshTokenStore.delete(decoded.tokenId);

        return {
            success: true,
            statusCode: 200,
            message: 'Token refreshed successfully',
            data: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            }
        };

    } catch (error) {
        return {
            success: false,
            statusCode: 401,
            message: 'Token refresh failed: ' + error.message
        };
    }
}

// Logout function
async function logoutUser(refreshTokenValue) {
    try {
        if (refreshTokenValue) {
            const decoded = jwt.verify(refreshTokenValue, AUTH_CONFIG.JWT_REFRESH_SECRET);
            refreshTokenStore.delete(decoded.tokenId);
        }

        return {
            success: true,
            statusCode: 200,
            message: 'Logged out successfully'
        };
    } catch (error) {
        return {
            success: true, // Still return success even if token is invalid
            statusCode: 200,
            message: 'Logged out successfully'
        };
    }
}

// Change password function
async function changePassword(userId, oldPassword, newPassword) {
    try {
        const user = userStore.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Verify old password
        const oldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!oldPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Validate new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            throw new Error(`Password requirements not met: ${passwordValidation.errors.join(', ')}`);
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, AUTH_CONFIG.BCRYPT_ROUNDS);
        user.passwordHash = newPasswordHash;

        // Invalidate all refresh tokens for this user
        for (const [tokenId, tokenData] of refreshTokenStore.entries()) {
            if (tokenData.userId === userId) {
                refreshTokenStore.delete(tokenId);
            }
        }

        return {
            success: true,
            statusCode: 200,
            message: 'Password changed successfully'
        };

    } catch (error) {
        return {
            success: false,
            statusCode: 400,
            message: error.message
        };
    }
}

// Get user profile
async function getUserProfile(userId) {
    try {
        const user = userStore.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const profile = {
            userId: user.userId,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            emailVerified: user.emailVerified,
            profile: user.profile
        };

        return {
            success: true,
            statusCode: 200,
            data: profile
        };

    } catch (error) {
        return {
            success: false,
            statusCode: 404,
            message: error.message
        };
    }
}

module.exports = {
    AUTH_CONFIG,
    authLimiter,
    loginLimiter,
    verifyToken,
    requireRole,
    validatePassword,
    registerUser,
    loginUser,
    refreshToken,
    logoutUser,
    changePassword,
    getUserProfile,
    generateTokens
};