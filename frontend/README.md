# Herb Abhilekh Frontend

A comprehensive frontend application for the Herb Abhilekh blockchain-based supply chain management system. This application provides complete traceability from farm to consumer with QR code scanning, role-based dashboards, and analytics.

## Features

### 🎯 Core Features
- **QR Code Scanning & Consumer View**: Instant access to complete product provenance through QR code scanning
- **Role-Based Dashboards**: Customized interfaces for farmers, manufacturers, laboratories, and regulators
- **Data Capture Forms**: Comprehensive forms for collection, processing, and quality test documentation
- **QR Code Generation**: Automatic QR code generation for medicines with blockchain linking
- **Analytics & Reporting**: Advanced analytics and reporting tools for stakeholders
- **Registration/Login System**: Secure authentication with role-based access control
- **End-to-End Traceability**: Complete demonstration of supply chain transparency

### 🎨 Design Features
- **Modern UI/UX**: Clean, responsive design with mobile-first approach
- **Herb Abhilekh Branding**: Consistent color theme (light green, dark green, charcoal)
- **Interactive Elements**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design patterns

## File Structure

```
frontend/
├── index.html              # Main landing page
├── analytics.html          # Analytics dashboard page
├── traceability.html       # End-to-end traceability demo
├── styles.css             # Main stylesheet
├── script.js              # Main JavaScript functionality
├── analytics.js           # Analytics dashboard functionality
├── traceability.js        # Traceability demo functionality
└── README.md              # This file
```

## Pages Overview

### 1. Landing Page (index.html)
- Hero section with QR code scanning
- Features overview
- Role-based dashboard access
- Registration and login modals

### 2. Analytics Dashboard (analytics.html)
- Key metrics visualization
- Interactive charts and graphs
- Quality reports
- Export functionality
- Recent activities table

### 3. Traceability Demo (traceability.html)
- Interactive supply chain flow
- Step-by-step demonstration
- QR code generation and scanning simulation
- Complete traceability information display

## Role-Based Features

### 👨‍🌾 Farmer Dashboard
- Create herb batches with GPS coordinates
- View batch history and analytics
- Environmental data tracking
- Batch transfer management

### 🏭 Manufacturer Dashboard
- Add processing steps
- Create final medicines
- Transfer batch ownership
- Processing condition tracking

### 🧪 Laboratory Dashboard
- Add quality test results
- View test history
- Quality analytics
- Certification management

### 🏛️ Regulator Dashboard
- Onboard new entities
- View complete blockchain ledger
- Track supply chain items
- System-wide analytics

## API Integration

The frontend integrates with the existing blockchain APIs:

### Authentication
- `POST /login` - User authentication
- `POST /registerFarmer` - Register farmer
- `POST /registerManufacturer` - Register manufacturer
- `POST /registerLaboratory` - Register laboratory

### Supply Chain Operations
- `POST /createHerbBatch` - Create herb batch
- `POST /addQualityTest` - Add quality test
- `POST /addProcessingStep` - Add processing step
- `POST /transferBatch` - Transfer batch
- `POST /createMedicine` - Create medicine

### Query Operations
- `POST /getConsumerInfo` - Get complete traceability info
- `POST /getBatchDetails` - Get batch details
- `POST /getMedicineDetails` - Get medicine details
- `POST /trackSupplyChain` - Track supply chain
- `POST /fetchLedger` - Get complete ledger

## Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local blockchain server running on port 5000
- HTTPS enabled for camera access (QR scanning)

### Installation
1. Ensure the blockchain server is running:
   ```bash
   cd server-node-sdk
   node app.js
   ```

2. Open the frontend in a web browser:
   - For local development: Open `index.html` directly
   - For production: Serve from a web server

3. For QR code scanning, ensure HTTPS is enabled or use localhost

### Configuration
- Update `API_BASE_URL` in JavaScript files if server runs on different port
- Modify color scheme in `styles.css` if needed
- Update API endpoints if backend changes

## Usage Guide

### 1. Getting Started
1. Open the application in your browser
2. Register a new account or login with existing credentials
3. Access your role-specific dashboard

### 2. QR Code Scanning
1. Click "Scan QR Code" button
2. Allow camera permissions
3. Point camera at QR code
4. View complete traceability information

### 3. Creating Content
1. Login with appropriate role
2. Navigate to dashboard
3. Use role-specific forms to create batches, tests, or medicines
4. View generated QR codes for medicines

### 4. Analytics
1. Navigate to Analytics page
2. View interactive charts and metrics
3. Export reports as needed

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Modern JavaScript features
- **Chart.js**: Interactive charts and graphs
- **QRCode.js**: QR code generation
- **jsQR**: QR code scanning

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Touch-friendly interface
- Optimized for all screen sizes

## Security Features

- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based requests
- **Secure Storage**: LocalStorage for user sessions
- **Role-Based Access**: UI elements based on user roles

## Performance Optimizations

- **Lazy Loading**: Images and components loaded on demand
- **Minification**: CSS and JavaScript minified for production
- **Caching**: Browser caching for static assets
- **Efficient Rendering**: Virtual DOM-like updates
- **Compressed Assets**: Optimized file sizes

## Troubleshooting

### Common Issues

1. **QR Code Scanning Not Working**
   - Ensure HTTPS is enabled
   - Check camera permissions
   - Try refreshing the page

2. **API Connection Errors**
   - Verify blockchain server is running
   - Check API_BASE_URL configuration
   - Ensure CORS is enabled on server

3. **Login Issues**
   - Clear browser cache and localStorage
   - Check user credentials
   - Verify server is responding

4. **Charts Not Displaying**
   - Check Chart.js library loading
   - Verify data format
   - Check browser console for errors

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL to see additional console logs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Apache 2.0 - See main project license

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify blockchain server status
4. Contact the development team

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Mobile app integration
- [ ] Offline functionality
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Export to PDF/Excel
- [ ] Batch operations
- [ ] User management
- [ ] Audit trails
