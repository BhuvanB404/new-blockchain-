# Ayurveda Supply Chain Management System

A React-based frontend for the Hyperledger Fabric blockchain supply chain management system for Ayurvedic medicines.

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Your Hyperledger Fabric backend running on localhost:5000

### Installation

1. **Download the project**:
   - Click the three dots (⋯) in the top right of the v0 code block
   - Select "Download ZIP" and extract the files

2. **Install dependencies**:
   \`\`\`bash
   cd ayurveda-supply-chain
   npm install
   \`\`\`

3. **Environment Configuration**:
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   \`\`\`

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## Features

- **Role-based Authentication**: Support for 5 user types (Regulator, Farmer, Manufacturer, Laboratory, Consumer)
- **QR Code Scanner**: Consumer medicine verification
- **Supply Chain Visualization**: Interactive timeline and maps
- **Quality Testing Interface**: Laboratory test management
- **Batch Management**: Create, transfer, and track herb batches
- **GPS Integration**: Location tracking and mapping
- **Blockchain Integration**: Real-time data from Hyperledger Fabric

## API Endpoints

The application connects to your Hyperledger Fabric backend on localhost:5000 and uses these endpoints:
- `/fetchLedger` - Get ledger data
- `/getBatchDetails` - Retrieve batch information
- `/createHerbBatch` - Create new herb batches
- `/transferBatch` - Transfer batches between entities
- `/addQualityTest` - Add quality test results
- `/createMedicine` - Create medicine records
- `/getConsumerInfo` - Get consumer verification data

## User Roles

1. **Regulator**: Monitor entire supply chain, view analytics
2. **Farmer**: Create herb batches, manage farm operations
3. **Manufacturer**: Process herbs into medicines, manage production
4. **Laboratory**: Conduct quality tests, manage certifications
5. **Consumer**: Verify medicine authenticity via QR codes

## Testing

1. Ensure your Hyperledger Fabric backend is running on localhost:5000
2. Use the login form with your blockchain user credentials
3. Navigate through role-specific dashboards
4. Test QR scanning with medicine IDs from your blockchain
5. Create test batches and transfers to verify blockchain integration
