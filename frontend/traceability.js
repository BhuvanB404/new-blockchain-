// Traceability Demo JavaScript
let demoStep = 0;
const demoSteps = ['step1', 'step2', 'step3', 'step4'];

// Initialize traceability demo
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    initializeDemo();
});

// Update user information
function updateUserInfo() {
    const savedUser = localStorage.getItem('herbAbhilekhUser');
    const userInfo = document.getElementById('userInfo');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        userInfo.textContent = `Welcome, ${user.name}`;
    } else {
        userInfo.textContent = 'Welcome, Guest';
    }
}

// Initialize demo
function initializeDemo() {
    // Reset all steps
    demoSteps.forEach(step => {
        const element = document.getElementById(step);
        if (element) {
            element.classList.remove('active', 'completed');
            const details = document.getElementById(step + 'Details');
            if (details) {
                details.style.display = 'none';
            }
        }
    });
    
    // Hide results sections
    document.getElementById('qrDisplaySection').style.display = 'none';
    document.getElementById('traceabilityResults').style.display = 'none';
    document.getElementById('blockchainVerification').style.display = 'none';
    
    demoStep = 0;
}

// Start traceability demo
async function startTraceabilityDemo() {
    showMessage('Starting traceability demonstration...', 'success');
    
    // Step 1: Collection
    await animateStep('step1', 2000);
    await simulateCollection();
    
    // Step 2: Quality Testing
    await animateStep('step2', 2000);
    await simulateQualityTesting();
    
    // Step 3: Processing
    await animateStep('step3', 2000);
    await simulateProcessing();
    
    // Step 4: Medicine Creation
    await animateStep('step4', 2000);
    await simulateMedicineCreation();
    
    // Generate QR Code
    generateDemoQRCode();
    
    showMessage('Traceability demonstration completed!', 'success');
}

// Animate step progression
async function animateStep(stepId, duration) {
    return new Promise((resolve) => {
        const element = document.getElementById(stepId);
        if (element) {
            element.classList.add('active');
            
            // Show details after a short delay
            setTimeout(() => {
                const details = document.getElementById(stepId + 'Details');
                if (details) {
                    details.style.display = 'block';
                }
                element.classList.add('completed');
                element.classList.remove('active');
                resolve();
            }, duration);
        } else {
            resolve();
        }
    });
}

// Simulate collection process
async function simulateCollection() {
    showMessage('Simulating herb collection with GPS coordinates...', 'success');
    // In a real implementation, this would call the actual API
    await delay(1000);
}

// Simulate quality testing
async function simulateQualityTesting() {
    showMessage('Simulating quality testing in laboratory...', 'success');
    // In a real implementation, this would call the actual API
    await delay(1000);
}

// Simulate processing
async function simulateProcessing() {
    showMessage('Simulating processing and manufacturing...', 'success');
    // In a real implementation, this would call the actual API
    await delay(1000);
}

// Simulate medicine creation
async function simulateMedicineCreation() {
    showMessage('Simulating medicine creation and QR code generation...', 'success');
    // In a real implementation, this would call the actual API
    await delay(1000);
}

// Generate demo QR code
function generateDemoQRCode() {
    const qrDisplaySection = document.getElementById('qrDisplaySection');
    const qrCanvas = document.getElementById('demoQRCode');
    
    qrDisplaySection.style.display = 'block';
    
    const medicineId = 'MED-ASHWA-DEMO-001';
    
    QRCode.toCanvas(qrCanvas, medicineId, {
        width: 200,
        height: 200,
        color: {
            dark: '#2d5a27',
            light: '#ffffff'
        }
    }, function (error) {
        if (error) {
            console.error('QR Code generation error:', error);
            showMessage('Error generating QR code', 'error');
        } else {
            showMessage('QR code generated successfully!', 'success');
        }
    });
}

// Generate sample QR code
function generateSampleQR() {
    generateDemoQRCode();
    showMessage('Sample QR code generated!', 'success');
}

// Simulate QR code scanning
function simulateQRScan() {
    showMessage('Simulating QR code scan...', 'success');
    
    // Show traceability results
    const traceabilityResults = document.getElementById('traceabilityResults');
    const blockchainVerification = document.getElementById('blockchainVerification');
    
    traceabilityResults.style.display = 'block';
    blockchainVerification.style.display = 'block';
    
    // Scroll to results
    traceabilityResults.scrollIntoView({ behavior: 'smooth' });
    
    showMessage('Complete traceability information displayed!', 'success');
}

// Reset demo
function resetDemo() {
    initializeDemo();
    showMessage('Demo reset successfully!', 'success');
}

// Utility function for delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Logout function
function logout() {
    localStorage.removeItem('herbAbhilekhUser');
    window.location.href = 'index.html';
}

// Show message utility
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right: '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.maxWidth = '300px';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Add CSS for traceability demo
const style = document.createElement('style');
style.textContent = `
    .traceability-demo {
        padding: 120px 0 80px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%);
        min-height: 100vh;
    }
    
    .demo-controls {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .demo-controls button {
        margin: 0 0.5rem;
    }
    
    .traceability-flow-demo {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-wrap: wrap;
        gap: 2rem;
        margin: 3rem 0;
    }
    
    .flow-step {
        text-align: center;
        flex: 1;
        min-width: 250px;
        padding: 2rem 1rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        opacity: 0.6;
    }
    
    .flow-step.active {
        opacity: 1;
        transform: scale(1.05);
        box-shadow: 0 4px 20px rgba(45, 90, 39, 0.3);
        border: 2px solid var(--primary-green);
    }
    
    .flow-step.completed {
        opacity: 1;
        border-left: 4px solid var(--primary-green);
    }
    
    .step-icon {
        width: 80px;
        height: 80px;
        background: var(--light-green);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        transition: all 0.3s ease;
    }
    
    .flow-step.active .step-icon {
        background: var(--primary-green);
        color: white;
        transform: scale(1.1);
    }
    
    .flow-step.completed .step-icon {
        background: var(--primary-green);
        color: white;
    }
    
    .step-icon i {
        font-size: 2rem;
    }
    
    .step-details {
        display: none;
        margin-top: 1.5rem;
        text-align: left;
    }
    
    .demo-data {
        background: var(--light-green);
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid var(--primary-green);
    }
    
    .demo-data h4 {
        color: var(--primary-green);
        margin-bottom: 1rem;
    }
    
    .demo-data ul {
        list-style: none;
        padding: 0;
    }
    
    .demo-data li {
        margin-bottom: 0.5rem;
        padding: 0.25rem 0;
    }
    
    .flow-arrow {
        font-size: 2rem;
        color: var(--primary-green);
        display: flex;
        align-items: center;
        margin-top: 2rem;
    }
    
    .qr-display-section {
        text-align: center;
        margin: 3rem 0;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .qr-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .qr-container canvas {
        border: 2px solid var(--primary-green);
        border-radius: 8px;
    }
    
    .traceability-results {
        margin: 3rem 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }
    
    .results-timeline {
        position: relative;
        padding-left: 2rem;
    }
    
    .results-timeline::before {
        content: '';
        position: absolute;
        left: 1rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--primary-green);
    }
    
    .timeline-item {
        position: relative;
        margin-bottom: 2rem;
        padding-left: 2rem;
    }
    
    .timeline-marker {
        position: absolute;
        left: -1.5rem;
        top: 0;
        width: 3rem;
        height: 3rem;
        background: var(--primary-green);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
    }
    
    .timeline-content {
        background: var(--light-green);
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid var(--primary-green);
    }
    
    .timeline-content h3 {
        color: var(--primary-green);
        margin-bottom: 1rem;
    }
    
    .timeline-content p {
        margin-bottom: 0.5rem;
    }
    
    .blockchain-verification {
        margin: 3rem 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }
    
    .verification-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .verification-item {
        text-align: center;
        padding: 2rem;
        background: var(--light-green);
        border-radius: 8px;
        border: 1px solid var(--primary-green);
    }
    
    .verification-item i {
        font-size: 3rem;
        color: var(--primary-green);
        margin-bottom: 1rem;
    }
    
    .verification-item h3 {
        color: var(--primary-green);
        margin-bottom: 1rem;
    }
    
    .nav-link.active {
        color: var(--primary-green);
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .traceability-flow-demo {
            flex-direction: column;
        }
        
        .flow-arrow {
            transform: rotate(90deg);
        }
        
        .verification-container {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);
