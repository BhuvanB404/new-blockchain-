# Herb Abhilekh React Frontend

A modern, beautiful React-based frontend for the Herb Abhilekh blockchain traceability system. Built with React 18, Vite, Tailwind CSS, and Framer Motion for a premium user experience.

## ✨ Features

### 🎨 Modern Design
- **Beautiful UI/UX**: Clean, modern design with smooth animations
- **Responsive Design**: Mobile-first approach with perfect scaling
- **Herb Abhilekh Branding**: Consistent color theme and typography
- **Interactive Elements**: Smooth transitions and hover effects

### 🔧 Core Functionality
- **QR Code Scanning**: Real-time camera-based QR code scanning
- **Role-Based Dashboards**: Customized interfaces for all user types
- **Data Capture Forms**: Comprehensive forms for all operations
- **Analytics Dashboard**: Interactive charts and reporting
- **End-to-End Traceability**: Complete supply chain visualization

### 🚀 Technical Features
- **React 18**: Latest React with hooks and concurrent features
- **Vite**: Lightning-fast development and building
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Beautiful, responsive charts
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

## 🛠️ Installation

### Prerequisites
- Node.js 16.x or later
- npm 8.x or later
- Blockchain server running on port 5000

### Setup
1. **Install dependencies:**
   ```bash
   cd frontend-react
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
frontend-react/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── forms/         # Form components
│   │   ├── Navbar.jsx     # Navigation component
│   │   ├── Footer.jsx     # Footer component
│   │   └── QRScanner.jsx  # QR code scanner
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── TraceabilityPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Pages Overview

### 1. Home Page (`/`)
- **Hero Section**: Eye-catching landing with call-to-action
- **Features Section**: Showcase of key capabilities
- **Stats Section**: Key metrics and achievements
- **Traceability Flow**: Visual supply chain process
- **Testimonials**: User feedback and reviews
- **CTA Section**: Call-to-action for registration

### 2. Dashboard Page (`/dashboard`)
- **Role-Based Interface**: Different views for each user type
- **Quick Actions**: Easy access to common tasks
- **Data Forms**: Modal-based forms for data entry
- **Real-time Updates**: Live data refresh

### 3. Analytics Page (`/analytics`)
- **Interactive Charts**: Production, quality, and performance metrics
- **Key Metrics**: Important KPIs at a glance
- **Recent Activities**: Live activity feed
- **Export Options**: PDF, Excel, CSV export

### 4. Traceability Page (`/traceability`)
- **Interactive Demo**: Step-by-step supply chain demonstration
- **QR Code Generation**: Create sample QR codes
- **Complete Timeline**: Full traceability information
- **Blockchain Verification**: Security and integrity proof

### 5. Authentication Pages
- **Login Page**: User authentication
- **Register Page**: New user registration with role selection

## 🔐 User Roles

### 👨‍🌾 Farmer
- Create herb batches with GPS coordinates
- View batch history and analytics
- Environmental data tracking

### 🏭 Manufacturer
- Add processing steps
- Create final medicines
- Transfer batch ownership

### 🧪 Laboratory
- Add quality test results
- View test history
- Quality analytics

### 🏛️ Regulator
- Onboard new entities
- View complete blockchain ledger
- Track supply chain items
- System-wide analytics

## 🎨 Design System

### Colors
- **Primary Green**: `#2d5a27` (Herb Abhilekh brand)
- **Light Green**: `#e8f5e8` (Backgrounds)
- **Accent Green**: `#4a7c59` (Secondary actions)
- **Dark Green**: `#1a3d1a` (Text and borders)

### Typography
- **Headings**: Playfair Display (serif)
- **Body Text**: Inter (sans-serif)

### Components
- **Buttons**: Primary, secondary, ghost variants
- **Cards**: Soft shadows with rounded corners
- **Forms**: Clean inputs with focus states
- **Modals**: Backdrop blur with smooth animations

## 🚀 Development

### Available Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Herb Abhilekh
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Features
- Touch-friendly interface
- Swipe gestures
- Optimized forms
- Mobile camera access

## 🔧 API Integration

The frontend integrates with the blockchain backend APIs:

### Authentication
- `POST /login` - User login
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
- `POST /getConsumerInfo` - Get traceability info
- `POST /getBatchDetails` - Get batch details
- `POST /trackSupplyChain` - Track supply chain
- `POST /fetchLedger` - Get complete ledger

## 🎭 Animations

### Framer Motion
- **Page Transitions**: Smooth page changes
- **Component Animations**: Hover and focus effects
- **Loading States**: Elegant loading indicators
- **Modal Animations**: Smooth open/close transitions

### CSS Animations
- **Floating Elements**: Subtle movement
- **Pulse Effects**: Attention-grabbing animations
- **Gradient Animations**: Dynamic backgrounds

## 🔒 Security

### Client-Side Security
- **Input Validation**: Form validation
- **XSS Protection**: Sanitized inputs
- **CSRF Protection**: Token-based requests
- **Secure Storage**: LocalStorage for sessions

### API Security
- **Authentication**: JWT-based auth
- **Role-Based Access**: UI elements based on roles
- **Error Handling**: Graceful error management

## 📊 Performance

### Optimizations
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format support
- **Bundle Analysis**: Optimized bundle size
- **Caching**: Browser caching strategies

### Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧪 Testing

### Test Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Test Coverage
- Component rendering
- User interactions
- API integration
- Error handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Build
npm run build

# Deploy dist folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Apache 2.0 - See main project license

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify blockchain server status
4. Contact the development team

## 🔮 Future Enhancements

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

---

Built with ❤️ for transparency in Ayurveda
