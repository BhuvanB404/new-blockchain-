// database.js - Database abstraction layer for persistent storage
'use strict';

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class DatabaseManager {
    constructor() {
        this.dbPath = path.join(process.cwd(), 'data');
        this.userDbPath = path.join(this.dbPath, 'users.json');
        this.tokenDbPath = path.join(this.dbPath, 'tokens.json');
        this.attemptsDbPath = path.join(this.dbPath, 'login_attempts.json');
        this.initialized = false;
    }

    async initialize() {
        try {
            // Create data directory if it doesn't exist
            await fs.mkdir(this.dbPath, { recursive: true });
            
            // Initialize database files if they don't exist
            await this.initializeFile(this.userDbPath, {});
            await this.initializeFile(this.tokenDbPath, {});
            await this.initializeFile(this.attemptsDbPath, {});
            
            this.initialized = true;
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization failed:', error.message);
            throw error;
        }
    }

    async initializeFile(filePath, defaultData) {
        try {
            await fs.access(filePath);
        } catch (error) {
            // File doesn't exist, create it
            await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
        }
    }

    async readData(filePath) {
        if (!this.initialized) await this.initialize();
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${filePath}:`, error.message);
            return {};
        }
    }

    async writeData(filePath, data) {
        if (!this.initialized) await this.initialize();
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error writing ${filePath}:`, error.message);
            throw error;
        }
    }

    // User management methods
    async getUser(userId) {
        const users = await this.readData(this.userDbPath);
        return users[userId];
    }

    async getUserByEmail(email) {
        const users = await this.readData(this.userDbPath);
        return Object.values(users).find(user => user.email === email);
    }

    async saveUser(userId, userData) {
        const users = await this.readData(this.userDbPath);
        users[userId] = userData;
        await this.writeData(this.userDbPath, users);
    }

    async deleteUser(userId) {
        const users = await this.readData(this.userDbPath);
        delete users[userId];
        await this.writeData(this.userDbPath, users);
    }

    async getAllUsers() {
        return await this.readData(this.userDbPath);
    }

    // Refresh token management
    async saveRefreshToken(tokenId, tokenData) {
        const tokens = await this.readData(this.tokenDbPath);
        tokens[tokenId] = tokenData;
        await this.writeData(this.tokenDbPath, tokens);
    }

    async getRefreshToken(tokenId) {
        const tokens = await this.readData(this.tokenDbPath);
        return tokens[tokenId];
    }

    async deleteRefreshToken(tokenId) {
        const tokens = await this.readData(this.tokenDbPath);
        delete tokens[tokenId];
        await this.writeData(this.tokenDbPath, tokens);
    }

    async deleteUserRefreshTokens(userId) {
        const tokens = await this.readData(this.tokenDbPath);
        const updatedTokens = {};
        
        for (const [tokenId, tokenData] of Object.entries(tokens)) {
            if (tokenData.userId !== userId) {
                updatedTokens[tokenId] = tokenData;
            }
        }
        
        await this.writeData(this.tokenDbPath, updatedTokens);
    }

    // Login attempts management
    async getLoginAttempts(identifier) {
        const attempts = await this.readData(this.attemptsDbPath);
        return attempts[identifier];
    }

    async saveLoginAttempts(identifier, attemptData) {
        const attempts = await this.readData(this.attemptsDbPath);
        attempts[identifier] = attemptData;
        await this.writeData(this.attemptsDbPath, attempts);
    }

    async deleteLoginAttempts(identifier) {
        const attempts = await this.readData(this.attemptsDbPath);
        delete attempts[identifier];
        await this.writeData(this.attemptsDbPath, attempts);
    }

    // Cleanup expired data
    async cleanupExpiredTokens() {
        const tokens = await this.readData(this.tokenDbPath);
        const updatedTokens = {};
        const now = new Date();
        
        for (const [tokenId, tokenData] of Object.entries(tokens)) {
            const expiryTime = new Date(tokenData.createdAt);
            expiryTime.setDate(expiryTime.getDate() + 7); // 7 days expiry
            
            if (expiryTime > now) {
                updatedTokens[tokenId] = tokenData;
            }
        }
        
        await this.writeData(this.tokenDbPath, updatedTokens);
    }

    async cleanupExpiredAttempts() {
        const attempts = await this.readData(this.attemptsDbPath);
        const updatedAttempts = {};
        const now = Date.now();
        const maxAge = 30 * 60 * 1000; // 30 minutes
        
        for (const [identifier, attemptData] of Object.entries(attempts)) {
            if (now - attemptData.lastAttempt < maxAge) {
                updatedAttempts[identifier] = attemptData;
            }
        }
        
        await this.writeData(this.attemptsDbPath, updatedAttempts);
    }
}

// Security utilities
class SecurityUtils {
    static generateSecureId(prefix = '', length = 16) {
        const randomBytes = crypto.randomBytes(length);
        const timestamp = Date.now().toString(36);
        return `${prefix}${timestamp}_${randomBytes.toString('hex')}`;
    }

    static generateCSRFToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    static hashSensitiveData(data) {
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest('hex');
    }

    static generateSecurePassword(length = 16) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        // Ensure at least one character from each required set
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
        password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
        password += '0123456789'[Math.floor(Math.random() * 10)]; // number
        password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special
        
        // Fill the rest randomly
        for (let i = 4; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        
        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isStrongPassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNoCommonPatterns = !/(123|abc|password|qwerty)/i.test(password);
        
        return password.length >= minLength &&
               hasUpperCase &&
               hasLowerCase &&
               hasNumbers &&
               hasSpecialChar &&
               hasNoCommonPatterns;
    }

    static generateApiKey(prefix = 'aysk') {
        const randomPart = crypto.randomBytes(24).toString('base64')
            .replace(/[+/]/g, '')
            .substring(0, 32);
        
        return `${prefix}_${randomPart}`;
    }

    static encryptSensitiveData(data, key) {
        const algorithm = 'aes-256-gcm';
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher(algorithm, key, iv);
        
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        
        return {
            encrypted: encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    static decryptSensitiveData(encryptedData, key) {
        const algorithm = 'aes-256-gcm';
        const decipher = crypto.createDecipher(
            algorithm, 
            key, 
            Buffer.from(encryptedData.iv, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }

    static rateLimitKey(req, identifier = null) {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || '';
        const key = identifier || `${ip}_${crypto.createHash('md5').update(userAgent).digest('hex')}`;
        
        return key;
    }

    static logSecurityEvent(event, details, severity = 'info') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            severity: severity,
            id: crypto.randomBytes(8).toString('hex')
        };
        
        console.log(`[SECURITY ${severity.toUpperCase()}] ${event}:`, JSON.stringify(logEntry));
        
        // In production, you would save this to a security log file or monitoring system
        return logEntry;
    }

    static detectSuspiciousActivity(req, userActivity = {}) {
        const suspiciousPatterns = [];
        const userAgent = req.headers['user-agent'] || '';
        const ip = req.ip || req.connection.remoteAddress;
        
        // Check for automated tools
        if (userAgent.toLowerCase().includes('bot') || 
            userAgent.toLowerCase().includes('crawler') ||
            userAgent.toLowerCase().includes('spider')) {
            suspiciousPatterns.push('Automated tool detected');
        }
        
        // Check for rapid requests
        if (userActivity.requestCount && userActivity.requestCount > 100) {
            suspiciousPatterns.push('High request frequency');
        }
        
        // Check for SQL injection patterns
        const body = JSON.stringify(req.body);
        const sqlPatterns = ['union select', 'drop table', '--', 'xp_cmdshell'];
        if (sqlPatterns.some(pattern => body.toLowerCase().includes(pattern))) {
            suspiciousPatterns.push('SQL injection attempt');
        }
        
        // Check for XSS patterns
        const xssPatterns = ['<script', 'javascript:', 'onerror=', 'onload='];
        if (xssPatterns.some(pattern => body.toLowerCase().includes(pattern))) {
            suspiciousPatterns.push('XSS attempt');
        }
        
        return {
            isSuspicious: suspiciousPatterns.length > 0,
            patterns: suspiciousPatterns,
            riskLevel: suspiciousPatterns.length > 2 ? 'high' : 
                      suspiciousPatterns.length > 0 ? 'medium' : 'low'
        };
    }
}

// Audit logging utility
class AuditLogger {
    constructor() {
        this.logPath = path.join(process.cwd(), 'logs', 'audit.log');
    }

    async initialize() {
        const logsDir = path.join(process.cwd(), 'logs');
        await fs.mkdir(logsDir, { recursive: true });
    }

    async logActivity(userId, action, details = {}, result = 'success') {
        await this.initialize();
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            userId: userId,
            action: action,
            details: details,
            result: result,
            id: crypto.randomBytes(8).toString('hex')
        };
        
        const logLine = JSON.stringify(logEntry) + '\n';
        
        try {
            await fs.appendFile(this.logPath, logLine);
        } catch (error) {
            console.error('Failed to write audit log:', error.message);
        }
        
        return logEntry;
    }

    async logAuthentication(userId, action, success, ip, userAgent) {
        return this.logActivity(userId, `auth_${action}`, {
            success: success,
            ip: ip,
            userAgent: userAgent
        }, success ? 'success' : 'failure');
    }

    async logFabricTransaction(userId, chaincode, function_name, success, txId = null) {
        return this.logActivity(userId, 'fabric_transaction', {
            chaincode: chaincode,
            function: function_name,
            transaction_id: txId
        }, success ? 'success' : 'failure');
    }

    async logDataAccess(userId, resource, action, success) {
        return this.logActivity(userId, 'data_access', {
            resource: resource,
            action: action
        }, success ? 'success' : 'failure');
    }
}

// Background cleanup service
class CleanupService {
    constructor(dbManager) {
        this.dbManager = dbManager;
        this.cleanupInterval = null;
    }

    start() {
        // Run cleanup every hour
        this.cleanupInterval = setInterval(async () => {
            try {
                console.log('Running background cleanup...');
                await this.dbManager.cleanupExpiredTokens();
                await this.dbManager.cleanupExpiredAttempts();
                console.log('Background cleanup completed');
            } catch (error) {
                console.error('Background cleanup failed:', error.message);
            }
        }, 60 * 60 * 1000); // 1 hour
    }

    stop() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}

module.exports = {
    DatabaseManager,
    SecurityUtils,
    AuditLogger,
    CleanupService
};