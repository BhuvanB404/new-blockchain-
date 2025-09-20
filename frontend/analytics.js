// Analytics Dashboard JavaScript
const API_BASE_URL = 'http://localhost:5000';

// Initialize analytics dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    loadAnalyticsData();
    setupCharts();
    loadRecentActivities();
    updateUserInfo();
});

// Initialize analytics dashboard
function initializeAnalytics() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('herbAbhilekhUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        updateUserInfo(user);
    }
}

// Update user information in navigation
function updateUserInfo(user = null) {
    const userInfo = document.getElementById('userInfo');
    if (user) {
        userInfo.textContent = `Welcome, ${user.name}`;
    } else {
        userInfo.textContent = 'Welcome, Guest';
    }
}

// Load analytics data
async function loadAnalyticsData() {
    try {
        // Load metrics
        await loadMetrics();
        
        // Load quality reports
        await loadQualityReports();
        
    } catch (error) {
        console.error('Error loading analytics data:', error);
        showMessage('Error loading analytics data', 'error');
    }
}

// Load key metrics
async function loadMetrics() {
    try {
        // Simulate loading metrics (in real implementation, these would come from API)
        const metrics = {
            totalBatches: 156,
            totalMedicines: 89,
            totalTests: 234,
            passRate: 94.2
        };

        document.getElementById('totalBatches').textContent = metrics.totalBatches;
        document.getElementById('totalMedicines').textContent = metrics.totalMedicines;
        document.getElementById('totalTests').textContent = metrics.totalTests;
        document.getElementById('passRate').textContent = metrics.passRate + '%';

    } catch (error) {
        console.error('Error loading metrics:', error);
    }
}

// Setup charts
function setupCharts() {
    setupProductionChart();
    setupQualityChart();
    setupHerbDistributionChart();
    setupSupplyChainChart();
}

// Production chart
function setupProductionChart() {
    const ctx = document.getElementById('productionChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Batches Created',
                data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 28, 24, 31],
                borderColor: '#2d5a27',
                backgroundColor: 'rgba(45, 90, 39, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Medicines Created',
                data: [8, 15, 12, 20, 18, 25, 22, 28, 26, 23, 19, 24],
                borderColor: '#4a7c59',
                backgroundColor: 'rgba(74, 124, 89, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Quality chart
function setupQualityChart() {
    const ctx = document.getElementById('qualityChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Passed', 'Failed', 'Pending'],
            datasets: [{
                data: [220, 14, 8],
                backgroundColor: [
                    '#2d5a27',
                    '#dc3545',
                    '#ffc107'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// Herb distribution chart
function setupHerbDistributionChart() {
    const ctx = document.getElementById('herbDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ashwagandha', 'Turmeric', 'Neem', 'Brahmi', 'Tulsi', 'Amla'],
            datasets: [{
                label: 'Quantity (kg)',
                data: [450, 380, 320, 280, 250, 200],
                backgroundColor: [
                    '#2d5a27',
                    '#4a7c59',
                    '#6b8e6b',
                    '#8db38d',
                    '#a8c8a8',
                    '#c3dcc3'
                ],
                borderColor: '#2d5a27',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Supply chain chart
function setupSupplyChainChart() {
    const ctx = document.getElementById('supplyChainChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Collection', 'Quality Testing', 'Processing', 'Packaging', 'Distribution', 'Retail'],
            datasets: [{
                label: 'Performance Score',
                data: [95, 88, 92, 90, 85, 87],
                borderColor: '#2d5a27',
                backgroundColor: 'rgba(45, 90, 39, 0.2)',
                pointBackgroundColor: '#2d5a27',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#2d5a27'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Load recent activities
async function loadRecentActivities() {
    try {
        // Simulate recent activities data
        const activities = [
            {
                timestamp: '2024-12-15 14:30:00',
                activity: 'Herb Batch Created',
                user: 'Farmer01',
                details: 'BATCH-ASH-001 - Ashwagandha',
                status: 'Success'
            },
            {
                timestamp: '2024-12-15 13:45:00',
                activity: 'Quality Test Added',
                user: 'Laboratory01',
                details: 'Pesticide test for BATCH-TUR-001',
                status: 'Success'
            },
            {
                timestamp: '2024-12-15 12:20:00',
                activity: 'Processing Step Added',
                user: 'Manufacturer01',
                details: 'Drying process for BATCH-NEEM-001',
                status: 'Success'
            },
            {
                timestamp: '2024-12-15 11:15:00',
                activity: 'Medicine Created',
                user: 'Manufacturer01',
                details: 'MED-COMPLEX-001 - Immunity Booster',
                status: 'Success'
            },
            {
                timestamp: '2024-12-15 10:30:00',
                activity: 'Batch Transfer',
                user: 'Farmer01',
                details: 'BATCH-ASH-001 transferred to Manufacturer01',
                status: 'Success'
            }
        ];

        const tbody = document.getElementById('activitiesTableBody');
        tbody.innerHTML = '';

        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.timestamp}</td>
                <td>${activity.activity}</td>
                <td>${activity.user}</td>
                <td>${activity.details}</td>
                <td><span class="status-badge success">${activity.status}</span></td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading recent activities:', error);
    }
}

// Load quality reports
async function loadQualityReports() {
    try {
        // Simulate quality report data
        const reports = {
            avgPesticide: '0.15 ppm',
            pesticideCompliance: '98.5%',
            avgMoisture: '9.8%',
            moistureRange: '8-12%',
            avgPurity: '96.2%',
            premiumGrade: '85%'
        };

        document.getElementById('avgPesticide').textContent = reports.avgPesticide;
        document.getElementById('pesticideCompliance').textContent = reports.pesticideCompliance;
        document.getElementById('avgMoisture').textContent = reports.avgMoisture;
        document.getElementById('moistureRange').textContent = reports.moistureRange;
        document.getElementById('avgPurity').textContent = reports.avgPurity;
        document.getElementById('premiumGrade').textContent = reports.premiumGrade;

    } catch (error) {
        console.error('Error loading quality reports:', error);
    }
}

// Export functions
function exportToPDF() {
    showMessage('PDF export feature coming soon!', 'success');
    // In a real implementation, this would generate a PDF report
}

function exportToExcel() {
    showMessage('Excel export feature coming soon!', 'success');
    // In a real implementation, this would generate an Excel file
}

function exportToCSV() {
    showMessage('CSV export feature coming soon!', 'success');
    // In a real implementation, this would generate a CSV file
}

// Logout function
function logout() {
    localStorage.removeItem('herbAbhilekhUser');
    window.location.href = 'index.html';
}

// Utility functions
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

// Add CSS for status badges
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .status-badge.success {
        background-color: #d4edda;
        color: #155724;
    }
    
    .status-badge.error {
        background-color: #f8d7da;
        color: #721c24;
    }
    
    .status-badge.warning {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .metric-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .metric-icon {
        width: 60px;
        height: 60px;
        background: var(--light-green);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: var(--primary-green);
    }
    
    .metric-content h3 {
        font-size: 2rem;
        color: var(--primary-green);
        margin: 0;
    }
    
    .metric-content p {
        color: var(--text-dark);
        margin: 0;
        font-weight: 500;
    }
    
    .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .data-section {
        margin-bottom: 3rem;
    }
    
    .table-container {
        overflow-x: auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .reports-section {
        margin-bottom: 3rem;
    }
    
    .reports-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .report-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .report-card h3 {
        color: var(--primary-green);
        margin-bottom: 1.5rem;
    }
    
    .report-metric {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .metric-label {
        color: var(--text-dark);
        font-weight: 500;
    }
    
    .metric-value {
        color: var(--primary-green);
        font-weight: 600;
    }
    
    .export-section {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .export-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 2rem;
    }
    
    .nav-link.active {
        color: var(--primary-green);
        font-weight: 600;
    }
`;
document.head.appendChild(style);
