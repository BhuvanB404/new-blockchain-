// Global variables
let currentUser = null;
let videoStream = null;
let scanningInterval = null;
const API_BASE_URL = 'http://localhost:5000';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize Application
function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('herbAbhilekhUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Authentication Functions
async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const loginData = {
        userId: formData.get('userId')
    };

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();
        
        if (response.ok) {
            currentUser = {
                userId: loginData.userId,
                role: result.role || 'user',
                name: result.name || loginData.userId
            };
            
            localStorage.setItem('herbAbhilekhUser', JSON.stringify(currentUser));
            updateUIForLoggedInUser();
            closeLoginModal();
            showMessage('Login successful!', 'success');
        } else {
            throw new Error(result.message || 'Login failed');
        }
    } catch (error) {
        showMessage(`Login error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const role = formData.get('role');
    
    const registerData = {
        adminId: 'Regulator01', // Default admin for registration
        userId: formData.get('userId'),
        name: formData.get('name'),
        location: formData.get('location')
    };

    // Add role-specific fields
    if (role === 'farmer') {
        registerData.farmLocation = formData.get('location');
    } else if (role === 'manufacturer') {
        registerData.companyName = formData.get('name');
    } else if (role === 'laboratory') {
        registerData.labName = formData.get('name');
        registerData.accreditation = 'NABL-17025-2024';
        registerData.certifications = ['ISO-17025', 'AYUSH-QC'];
    }

    try {
        showLoading(true);
        let endpoint = '';
        switch (role) {
            case 'farmer':
                endpoint = '/registerFarmer';
                break;
            case 'manufacturer':
                endpoint = '/registerManufacturer';
                break;
            case 'laboratory':
                endpoint = '/registerLaboratory';
                break;
            default:
                throw new Error('Invalid role selected');
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        });

        const result = await response.json();
        
        if (response.ok) {
            showMessage('Registration successful! Please login.', 'success');
            closeRegisterModal();
        } else {
            throw new Error(result.message || 'Registration failed');
        }
    } catch (error) {
        showMessage(`Registration error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

// QR Code Scanning Functions
function showQRScanner() {
    const modal = document.getElementById('qrScannerModal');
    modal.style.display = 'block';
}

function closeQRScanner() {
    const modal = document.getElementById('qrScannerModal');
    modal.style.display = 'none';
    stopScanning();
}

async function startScanning() {
    try {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');

        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        video.srcObject = videoStream;
        video.play();

        scanningInterval = setInterval(() => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    handleQRCodeScanned(code.data);
                }
            }
        }, 100);
    } catch (error) {
        showMessage('Error accessing camera: ' + error.message, 'error');
    }
}

function stopScanning() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    if (scanningInterval) {
        clearInterval(scanningInterval);
        scanningInterval = null;
    }
}

async function handleQRCodeScanned(qrData) {
    stopScanning();
    closeQRScanner();
    
    try {
        showLoading(true);
        // Try to get consumer info using the QR data as medicine ID
        const response = await fetch(`${API_BASE_URL}/getConsumerInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser ? currentUser.userId : 'Regulator01',
                medicineId: qrData
            })
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            displayTraceabilityInfo(result.data);
        } else {
            // Try as batch ID if medicine ID fails
            const batchResponse = await fetch(`${API_BASE_URL}/getBatchDetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser ? currentUser.userId : 'Regulator01',
                    batchId: qrData
                })
            });

            const batchResult = await batchResponse.json();
            
            if (batchResponse.ok && batchResult.success) {
                displayBatchInfo(batchResult.data);
            } else {
                throw new Error('QR code not recognized in the system');
            }
        }
    } catch (error) {
        showMessage(`Error scanning QR code: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

// Modal Functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
}

function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.style.display = 'none';
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.style.display = 'none';
}

// UI Update Functions
function updateUIForLoggedInUser() {
    if (!currentUser) return;

    // Update navigation
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
        navAuth.innerHTML = `
            <span class="user-info">Welcome, ${currentUser.name}</span>
            <button class="btn-secondary" onclick="logout()">Logout</button>
        `;
    }

    // Update dashboard
    loadDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('herbAbhilekhUser');
    location.reload();
}

async function loadDashboard() {
    if (!currentUser) return;

    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        showLoading(true);
        
        let dashboardHTML = '';
        
        switch (currentUser.role) {
            case 'farmer':
                dashboardHTML = await loadFarmerDashboard();
                break;
            case 'manufacturer':
                dashboardHTML = await loadManufacturerDashboard();
                break;
            case 'laboratory':
                dashboardHTML = await loadLaboratoryDashboard();
                break;
            case 'regulator':
                dashboardHTML = await loadRegulatorDashboard();
                break;
            default:
                dashboardHTML = await loadGeneralDashboard();
        }

        dashboardContent.innerHTML = dashboardHTML;
    } catch (error) {
        dashboardContent.innerHTML = `
            <div class="message error">
                Error loading dashboard: ${error.message}
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

// Role-specific Dashboard Functions
async function loadFarmerDashboard() {
    return `
        <div class="dashboard-grid">
            <div class="dashboard-card role-farmer">
                <h3><i class="fas fa-seedling"></i> Create Herb Batch</h3>
                <p>Record new herb collection with GPS coordinates and environmental data</p>
                <button class="btn-primary" onclick="showCreateBatchForm()">Create Batch</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-list"></i> My Batches</h3>
                <p>View and manage your herb batches</p>
                <button class="btn-secondary" onclick="loadFarmerBatches()">View Batches</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-chart-line"></i> Analytics</h3>
                <p>Track your production and quality metrics</p>
                <button class="btn-secondary" onclick="loadFarmerAnalytics()">View Analytics</button>
            </div>
        </div>
        <div id="dashboardData"></div>
    `;
}

async function loadManufacturerDashboard() {
    return `
        <div class="dashboard-grid">
            <div class="dashboard-card role-manufacturer">
                <h3><i class="fas fa-cogs"></i> Add Processing Step</h3>
                <p>Record processing activities and conditions</p>
                <button class="btn-primary" onclick="showProcessingForm()">Add Processing</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-pills"></i> Create Medicine</h3>
                <p>Create final medicine products from processed batches</p>
                <button class="btn-primary" onclick="showCreateMedicineForm()">Create Medicine</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-exchange-alt"></i> Transfer Batches</h3>
                <p>Transfer batch ownership in the supply chain</p>
                <button class="btn-secondary" onclick="showTransferForm()">Transfer Batch</button>
            </div>
        </div>
        <div id="dashboardData"></div>
    `;
}

async function loadLaboratoryDashboard() {
    return `
        <div class="dashboard-grid">
            <div class="dashboard-card role-laboratory">
                <h3><i class="fas fa-flask"></i> Add Quality Test</h3>
                <p>Record quality test results and certifications</p>
                <button class="btn-primary" onclick="showQualityTestForm()">Add Test</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-certificate"></i> Test Results</h3>
                <p>View and manage quality test results</p>
                <button class="btn-secondary" onclick="loadTestResults()">View Results</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-chart-bar"></i> Quality Analytics</h3>
                <p>Analyze quality trends and compliance</p>
                <button class="btn-secondary" onclick="loadQualityAnalytics()">View Analytics</button>
            </div>
        </div>
        <div id="dashboardData"></div>
    `;
}

async function loadRegulatorDashboard() {
    return `
        <div class="dashboard-grid">
            <div class="dashboard-card role-regulator">
                <h3><i class="fas fa-users"></i> Onboard Entities</h3>
                <p>Onboard farmers, manufacturers, and laboratories</p>
                <button class="btn-primary" onclick="showOnboardForm()">Onboard Entity</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-database"></i> Complete Ledger</h3>
                <p>View the complete blockchain ledger</p>
                <button class="btn-secondary" onclick="loadCompleteLedger()">View Ledger</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-search"></i> Track Supply Chain</h3>
                <p>Track any item through the complete supply chain</p>
                <button class="btn-secondary" onclick="showTrackForm()">Track Item</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-chart-pie"></i> System Analytics</h3>
                <p>Comprehensive system analytics and reporting</p>
                <button class="btn-secondary" onclick="loadSystemAnalytics()">View Analytics</button>
            </div>
        </div>
        <div id="dashboardData"></div>
    `;
}

async function loadGeneralDashboard() {
    return `
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h3><i class="fas fa-qrcode"></i> Scan QR Code</h3>
                <p>Scan QR codes to view product traceability</p>
                <button class="btn-primary" onclick="showQRScanner()">Scan QR</button>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-search"></i> Search Products</h3>
                <p>Search for products by ID or name</p>
                <button class="btn-secondary" onclick="showSearchForm()">Search</button>
            </div>
        </div>
        <div id="dashboardData"></div>
    `;
}

// Form Display Functions
function showCreateBatchForm() {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Create Herb Batch</h3>
            <form id="createBatchForm">
                <div class="form-group">
                    <label for="batchId">Batch ID</label>
                    <input type="text" id="batchId" name="batchId" required>
                </div>
                <div class="form-group">
                    <label for="herbName">Herb Name</label>
                    <input type="text" id="herbName" name="herbName" required>
                </div>
                <div class="form-group">
                    <label for="harvestDate">Harvest Date</label>
                    <input type="date" id="harvestDate" name="harvestDate" required>
                </div>
                <div class="form-group">
                    <label for="farmLocation">Farm Location</label>
                    <input type="text" id="farmLocation" name="farmLocation" required>
                </div>
                <div class="form-group">
                    <label for="quantity">Quantity</label>
                    <input type="text" id="quantity" name="quantity" placeholder="e.g., 250kg" required>
                </div>
                <div class="form-group">
                    <label for="latitude">GPS Latitude</label>
                    <input type="number" id="latitude" name="latitude" step="any" required>
                </div>
                <div class="form-group">
                    <label for="longitude">GPS Longitude</label>
                    <input type="number" id="longitude" name="longitude" step="any" required>
                </div>
                <div class="form-group">
                    <label for="temperature">Temperature</label>
                    <input type="text" id="temperature" name="temperature" placeholder="e.g., 28°C" required>
                </div>
                <div class="form-group">
                    <label for="humidity">Humidity</label>
                    <input type="text" id="humidity" name="humidity" placeholder="e.g., 75%" required>
                </div>
                <div class="form-group">
                    <label for="soilType">Soil Type</label>
                    <input type="text" id="soilType" name="soilType" required>
                </div>
                <button type="submit" class="btn-primary">Create Batch</button>
            </form>
        </div>
    `;

    document.getElementById('createBatchForm').addEventListener('submit', handleCreateBatch);
}

function showQualityTestForm() {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Add Quality Test</h3>
            <form id="qualityTestForm">
                <div class="form-group">
                    <label for="testBatchId">Batch ID</label>
                    <input type="text" id="testBatchId" name="batchId" required>
                </div>
                <div class="form-group">
                    <label for="testType">Test Type</label>
                    <select id="testType" name="testType" required>
                        <option value="">Select Test Type</option>
                        <option value="moisture">Moisture</option>
                        <option value="pesticide">Pesticide</option>
                        <option value="purity">Purity</option>
                        <option value="curcumin">Curcumin (for Turmeric)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="testDate">Test Date</label>
                    <input type="date" id="testDate" name="testDate" required>
                </div>
                <div class="form-group">
                    <label for="moisture">Moisture (%)</label>
                    <input type="number" id="moisture" name="moisture" step="0.1" required>
                </div>
                <div class="form-group">
                    <label for="pesticide">Pesticide (ppm)</label>
                    <input type="number" id="pesticide" name="pesticide" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="purity">Purity (%)</label>
                    <input type="number" id="purity" name="purity" step="0.1" required>
                </div>
                <div class="form-group">
                    <label for="certification">Certification Number</label>
                    <input type="text" id="certification" name="certification" required>
                </div>
                <button type="submit" class="btn-primary">Add Test</button>
            </form>
        </div>
    `;

    document.getElementById('qualityTestForm').addEventListener('submit', handleQualityTest);
}

function showProcessingForm() {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Add Processing Step</h3>
            <form id="processingForm">
                <div class="form-group">
                    <label for="procBatchId">Batch ID</label>
                    <input type="text" id="procBatchId" name="batchId" required>
                </div>
                <div class="form-group">
                    <label for="processingType">Processing Type</label>
                    <select id="processingType" name="processingType" required>
                        <option value="">Select Processing Type</option>
                        <option value="drying">Drying</option>
                        <option value="grinding">Grinding</option>
                        <option value="extraction">Extraction</option>
                        <option value="packaging">Packaging</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="processingDate">Processing Date</label>
                    <input type="date" id="processingDate" name="processingDate" required>
                </div>
                <div class="form-group">
                    <label for="processingLocation">Processing Location</label>
                    <input type="text" id="processingLocation" name="processingLocation" required>
                </div>
                <div class="form-group">
                    <label for="temperature">Temperature (°C)</label>
                    <input type="number" id="temperature" name="temperature" required>
                </div>
                <div class="form-group">
                    <label for="duration">Duration (hours)</label>
                    <input type="number" id="duration" name="duration" required>
                </div>
                <div class="form-group">
                    <label for="method">Method</label>
                    <input type="text" id="method" name="method" required>
                </div>
                <div class="form-group">
                    <label for="yield">Output Yield</label>
                    <input type="text" id="yield" name="yield" placeholder="e.g., 200kg" required>
                </div>
                <button type="submit" class="btn-primary">Add Processing</button>
            </form>
        </div>
    `;

    document.getElementById('processingForm').addEventListener('submit', handleProcessing);
}

function showCreateMedicineForm() {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Create Medicine</h3>
            <form id="createMedicineForm">
                <div class="form-group">
                    <label for="medicineId">Medicine ID</label>
                    <input type="text" id="medicineId" name="medicineId" required>
                </div>
                <div class="form-group">
                    <label for="medicineName">Medicine Name</label>
                    <input type="text" id="medicineName" name="medicineName" required>
                </div>
                <div class="form-group">
                    <label for="batchIds">Batch IDs (comma-separated)</label>
                    <input type="text" id="batchIds" name="batchIds" placeholder="BATCH-ASH-001, BATCH-TUR-001" required>
                </div>
                <div class="form-group">
                    <label for="manufacturingDate">Manufacturing Date</label>
                    <input type="date" id="manufacturingDate" name="manufacturingDate" required>
                </div>
                <div class="form-group">
                    <label for="expiryDate">Expiry Date</label>
                    <input type="date" id="expiryDate" name="expiryDate" required>
                </div>
                <button type="submit" class="btn-primary">Create Medicine</button>
            </form>
        </div>
    `;

    document.getElementById('createMedicineForm').addEventListener('submit', handleCreateMedicine);
}

// Form Handler Functions
async function handleCreateBatch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const batchData = {
        userId: currentUser.userId,
        batchId: formData.get('batchId'),
        herbName: formData.get('herbName'),
        harvestDate: formData.get('harvestDate'),
        farmLocation: formData.get('farmLocation'),
        quantity: formData.get('quantity'),
        gpsCoordinates: {
            latitude: parseFloat(formData.get('latitude')),
            longitude: parseFloat(formData.get('longitude'))
        },
        collectorId: currentUser.userId,
        environmentalData: {
            temperature: formData.get('temperature'),
            humidity: formData.get('humidity'),
            soilType: formData.get('soilType')
        }
    };

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/createHerbBatch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(batchData)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage('Herb batch created successfully!', 'success');
            event.target.reset();
        } else {
            throw new Error(result.message || 'Failed to create batch');
        }
    } catch (error) {
        showMessage(`Error creating batch: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleQualityTest(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const testData = {
        userId: currentUser.userId,
        batchId: formData.get('batchId'),
        labId: currentUser.userId,
        testType: formData.get('testType'),
        testResults: {
            moisture: parseFloat(formData.get('moisture')),
            pesticide: parseFloat(formData.get('pesticide')),
            purity: parseFloat(formData.get('purity'))
        },
        testDate: formData.get('testDate'),
        certification: formData.get('certification'),
        labLocation: 'Laboratory'
    };

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/addQualityTest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage('Quality test added successfully!', 'success');
            event.target.reset();
        } else {
            throw new Error(result.message || 'Failed to add quality test');
        }
    } catch (error) {
        showMessage(`Error adding quality test: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleProcessing(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const processingData = {
        userId: currentUser.userId,
        batchId: formData.get('batchId'),
        processingType: formData.get('processingType'),
        processingDate: formData.get('processingDate'),
        processingLocation: formData.get('processingLocation'),
        processingConditions: {
            temperature: parseInt(formData.get('temperature')),
            duration: parseInt(formData.get('duration')),
            method: formData.get('method')
        },
        outputMetrics: {
            yield: formData.get('yield'),
            moisture_after: 8.5,
            quality_grade: 'Premium'
        },
        equipmentUsed: 'Processing Equipment',
        operatorId: currentUser.userId
    };

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/addProcessingStep`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(processingData)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage('Processing step added successfully!', 'success');
            event.target.reset();
        } else {
            throw new Error(result.message || 'Failed to add processing step');
        }
    } catch (error) {
        showMessage(`Error adding processing step: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleCreateMedicine(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const medicineData = {
        userId: currentUser.userId,
        medicineId: formData.get('medicineId'),
        medicineName: formData.get('medicineName'),
        batchIds: formData.get('batchIds').split(',').map(id => id.trim()),
        manufacturingDate: formData.get('manufacturingDate'),
        expiryDate: formData.get('expiryDate')
    };

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/createMedicine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medicineData)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage('Medicine created successfully!', 'success');
            event.target.reset();
            // Generate QR code for the medicine
            generateQRCode(medicineData.medicineId);
        } else {
            throw new Error(result.message || 'Failed to create medicine');
        }
    } catch (error) {
        showMessage(`Error creating medicine: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

// QR Code Generation
function generateQRCode(medicineId) {
    const dashboardData = document.getElementById('dashboardData');
    const qrContainer = document.createElement('div');
    qrContainer.className = 'qr-display';
    qrContainer.innerHTML = `
        <h3>QR Code for Medicine: ${medicineId}</h3>
        <canvas id="qrCanvas"></canvas>
        <p>Scan this QR code to view complete traceability information</p>
    `;
    
    dashboardData.appendChild(qrContainer);
    
    QRCode.toCanvas(document.getElementById('qrCanvas'), medicineId, {
        width: 200,
        height: 200,
        color: {
            dark: '#2d5a27',
            light: '#ffffff'
        }
    }, function (error) {
        if (error) {
            console.error('QR Code generation error:', error);
        }
    });
}

// Display Functions
function displayTraceabilityInfo(data) {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Complete Traceability Information</h3>
            <div class="traceability-info">
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    `;
}

function displayBatchInfo(data) {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Batch Information</h3>
            <div class="batch-info">
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    `;
}

// Utility Functions
function showLoading(show) {
    const existingLoader = document.querySelector('.loading');
    if (show && !existingLoader) {
        const loader = document.createElement('div');
        loader.className = 'loading';
        loader.style.position = 'fixed';
        loader.style.top = '50%';
        loader.style.left = '50%';
        loader.style.transform = 'translate(-50%, -50%)';
        loader.style.zIndex = '9999';
        document.body.appendChild(loader);
    } else if (!show && existingLoader) {
        existingLoader.remove();
    }
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.maxWidth = '300px';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function checkAuthStatus() {
    // This function can be used to check authentication status on page load
    // For now, it's handled in initializeApp()
}

// Additional utility functions for other dashboard features
async function loadFarmerBatches() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/getBatchesByFarmer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.userId,
                farmerId: currentUser.userId
            })
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            displayFarmerBatches(result.data);
        } else {
            throw new Error(result.message || 'Failed to load batches');
        }
    } catch (error) {
        showMessage(`Error loading batches: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function displayFarmerBatches(batches) {
    const dashboardData = document.getElementById('dashboardData');
    let html = '<div class="dashboard-card"><h3>My Batches</h3>';
    
    if (batches && batches.length > 0) {
        html += '<table class="data-table"><thead><tr><th>Batch ID</th><th>Herb Name</th><th>Quantity</th><th>Harvest Date</th><th>Status</th></tr></thead><tbody>';
        
        batches.forEach(batch => {
            html += `<tr>
                <td>${batch.batchId || 'N/A'}</td>
                <td>${batch.herbName || 'N/A'}</td>
                <td>${batch.quantity || 'N/A'}</td>
                <td>${batch.harvestDate || 'N/A'}</td>
                <td><span class="status-badge success">Active</span></td>
            </tr>`;
        });
        
        html += '</tbody></table>';
    } else {
        html += '<p>No batches found. Create your first batch!</p>';
    }
    
    html += '</div>';
    dashboardData.innerHTML = html;
}

async function loadFarmerAnalytics() {
    window.location.href = 'analytics.html';
}

async function loadTestResults() {
    try {
        showLoading(true);
        // This would typically fetch test results for the laboratory
        const dashboardData = document.getElementById('dashboardData');
        dashboardData.innerHTML = `
            <div class="dashboard-card">
                <h3>Recent Test Results</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Batch ID</th>
                            <th>Test Type</th>
                            <th>Result</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>BATCH-ASH-001</td>
                            <td>Moisture</td>
                            <td>10.5%</td>
                            <td>2024-12-15</td>
                            <td><span class="status-badge success">Passed</span></td>
                        </tr>
                        <tr>
                            <td>BATCH-TUR-001</td>
                            <td>Pesticide</td>
                            <td>0.15 ppm</td>
                            <td>2024-12-14</td>
                            <td><span class="status-badge success">Passed</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        showMessage(`Error loading test results: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function loadQualityAnalytics() {
    window.location.href = 'analytics.html';
}

async function loadCompleteLedger() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/fetchLedger`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.userId
            })
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            displayCompleteLedger(result.data);
        } else {
            throw new Error(result.message || 'Failed to load ledger');
        }
    } catch (error) {
        showMessage(`Error loading ledger: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function displayCompleteLedger(ledger) {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Complete Blockchain Ledger</h3>
            <div class="ledger-content">
                <pre>${JSON.stringify(ledger, null, 2)}</pre>
            </div>
        </div>
    `;
}

async function loadSystemAnalytics() {
    window.location.href = 'analytics.html';
}

function showOnboardForm() {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Onboard New Entity</h3>
            <form id="onboardForm">
                <div class="form-group">
                    <label for="entityType">Entity Type</label>
                    <select id="entityType" name="entityType" required>
                        <option value="">Select Entity Type</option>
                        <option value="farmer">Farmer</option>
                        <option value="manufacturer">Manufacturer</option>
                        <option value="laboratory">Laboratory</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="entityId">Entity ID</label>
                    <input type="text" id="entityId" name="entityId" required>
                </div>
                <div class="form-group">
                    <label for="entityName">Name</label>
                    <input type="text" id="entityName" name="entityName" required>
                </div>
                <div class="form-group">
                    <label for="entityLocation">Location</label>
                    <input type="text" id="entityLocation" name="entityLocation" required>
                </div>
                <button type="submit" class="btn-primary">Onboard Entity</button>
            </form>
        </div>
    `;

    document.getElementById('onboardForm').addEventListener('submit', handleOnboardEntity);
}

async function handleOnboardEntity(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const entityType = formData.get('entityType');
    
    const onboardData = {
        userId: currentUser.userId,
        [entityType + 'Id']: formData.get('entityId'),
        name: formData.get('entityName'),
        location: formData.get('entityLocation')
    };

    // Add role-specific fields
    if (entityType === 'farmer') {
        onboardData.farmLocation = formData.get('entityLocation');
    } else if (entityType === 'manufacturer') {
        onboardData.companyName = formData.get('entityName');
    } else if (entityType === 'laboratory') {
        onboardData.labName = formData.get('entityName');
        onboardData.accreditation = 'NABL-17025-2024';
        onboardData.certifications = ['ISO-17025', 'AYUSH-QC'];
    }

    try {
        showLoading(true);
        let endpoint = '';
        switch (entityType) {
            case 'farmer':
                endpoint = '/onboardFarmer';
                break;
            case 'manufacturer':
                endpoint = '/onboardManufacturer';
                break;
            case 'laboratory':
                endpoint = '/onboardLaboratory';
                break;
            default:
                throw new Error('Invalid entity type selected');
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(onboardData)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage('Entity onboarded successfully!', 'success');
            event.target.reset();
        } else {
            throw new Error(result.message || 'Failed to onboard entity');
        }
    } catch (error) {
        showMessage(`Error onboarding entity: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function showTransferForm() {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Transfer Batch</h3>
            <form id="transferForm">
                <div class="form-group">
                    <label for="transferBatchId">Batch ID</label>
                    <input type="text" id="transferBatchId" name="batchId" required>
                </div>
                <div class="form-group">
                    <label for="toEntityId">Transfer To (Entity ID)</label>
                    <input type="text" id="toEntityId" name="toEntityId" required>
                </div>
                <div class="form-group">
                    <label for="transferReason">Transfer Reason</label>
                    <input type="text" id="transferReason" name="transferReason" required>
                </div>
                <button type="submit" class="btn-primary">Transfer Batch</button>
            </form>
        </div>
    `;

    document.getElementById('transferForm').addEventListener('submit', handleTransferBatch);
}

async function handleTransferBatch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const transferData = {
        userId: currentUser.userId,
        batchId: formData.get('batchId'),
        toEntityId: formData.get('toEntityId'),
        transferReason: formData.get('transferReason')
    };

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/transferBatch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transferData)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage('Batch transferred successfully!', 'success');
            event.target.reset();
        } else {
            throw new Error(result.message || 'Failed to transfer batch');
        }
    } catch (error) {
        showMessage(`Error transferring batch: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function showTrackForm() {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Track Supply Chain</h3>
            <form id="trackForm">
                <div class="form-group">
                    <label for="trackItemId">Item ID (Medicine ID or Batch ID)</label>
                    <input type="text" id="trackItemId" name="itemId" required>
                </div>
                <button type="submit" class="btn-primary">Track Item</button>
            </form>
        </div>
    `;

    document.getElementById('trackForm').addEventListener('submit', handleTrackItem);
}

async function handleTrackItem(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const trackData = {
        userId: currentUser.userId,
        itemId: formData.get('itemId')
    };

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/trackSupplyChain`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trackData)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            displayTrackResults(result.data);
        } else {
            throw new Error(result.message || 'Failed to track item');
        }
    } catch (error) {
        showMessage(`Error tracking item: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function displayTrackResults(data) {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Supply Chain Tracking Results</h3>
            <div class="track-results">
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    `;
}

function showSearchForm() {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Search Products</h3>
            <form id="searchForm">
                <div class="form-group">
                    <label for="searchQuery">Search Query</label>
                    <input type="text" id="searchQuery" name="query" placeholder="Enter Medicine ID, Batch ID, or Herb Name" required>
                </div>
                <button type="submit" class="btn-primary">Search</button>
            </form>
        </div>
    `;

    document.getElementById('searchForm').addEventListener('submit', handleSearch);
}

async function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const query = formData.get('query');
    
    try {
        showLoading(true);
        
        // Try different search methods
        let results = null;
        
        // Try as medicine ID first
        try {
            const response = await fetch(`${API_BASE_URL}/getConsumerInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser ? currentUser.userId : 'Regulator01',
                    medicineId: query
                })
            });
            
            const result = await response.json();
            if (response.ok && result.success) {
                results = { type: 'medicine', data: result.data };
            }
        } catch (e) {
            // Continue to next search method
        }
        
        // Try as batch ID if medicine search failed
        if (!results) {
            try {
                const response = await fetch(`${API_BASE_URL}/getBatchDetails`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: currentUser ? currentUser.userId : 'Regulator01',
                        batchId: query
                    })
                });
                
                const result = await response.json();
                if (response.ok && result.success) {
                    results = { type: 'batch', data: result.data };
                }
            } catch (e) {
                // Continue to next search method
            }
        }
        
        if (results) {
            displaySearchResults(results);
        } else {
            throw new Error('No results found for the search query');
        }
        
    } catch (error) {
        showMessage(`Search error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function displaySearchResults(results) {
    const dashboardData = document.getElementById('dashboardData');
    dashboardData.innerHTML = `
        <div class="dashboard-card">
            <h3>Search Results (${results.type})</h3>
            <div class="search-results">
                <pre>${JSON.stringify(results.data, null, 2)}</pre>
            </div>
        </div>
    `;
}
