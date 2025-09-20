# Ayurveda Supply Chain Blockchain

A comprehensive blockchain-based supply chain management system for Ayurveda medicines using Hyperledger Fabric. This system provides complete traceability from farm to consumer, ensuring quality, authenticity, and sustainability of Ayurvedic products.

## Features

- **Multi-Organization Support**: Org1 (Regulators/Farmers/Manufacturers) and Org2 (Laboratories)
- **FHIR-Compliant Data Structure**: Healthcare interoperability standards
- **Geo-fencing Validation**: Ensures herbs are harvested from approved zones in India
- **Seasonal Harvest Restrictions**: Validates harvest dates against plant-specific seasons
- **Quality Standards Validation**: Automated quality checking against predefined thresholds
- **Sustainability Tracking**: Conservation limits and vulnerability assessments
- **Complete Traceability**: From farm to consumer with QR code support
- **Processing Step Tracking**: Detailed processing conditions and validations

## Prerequisites

- Ubuntu 20.04 LTS or later / macOS 10.15+
- Docker 20.10.x or later
- Docker Compose 1.29.x or later
- Node.js 16.x or later
- npm 8.x or later
- Git 2.30+
- curl (for testing)
- jq (for JSON formatting)

## Installation & Setup

### 1. Install Prerequisites

### 4. Start Network and Deploy Chaincode

```bash
# Navigate to test-network

./install-fabric.sh

cd  fabric-samples/test-network

./network.sh down &&
   ./network.sh up createChannel -ca -s couchdb && ./network.sh deployCC -ccn ehrChainCode -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript

# Deploy the chaincode

# Verify deployment
docker ps | grep ehrChainCode
```

### 5. Setup Application

```bash
# Navigate to workspace and create app directory
# Initialize Node.js application

#from root directory

cd server-node-sdk/

npm init -y

# Install dependencies
npm install express cors fabric-network fabric-ca-client

rm -rf wallet/
# Create wallet directory

# Copy all the application files (app.js, helper.js, invoke.js, query.js, etc.)
```

## Identity Setup

Run these commands in order to set up all required identities:

```bash
# 1. Enroll Org1 Admin (Regulator Admin)
node ayurveda_admin_reg.js

# 2. Enroll Org2 Admin (Lab Admin)
node ayurveda_admin_org2.js

# 3. Register and enroll users
node ayurveda_onboard_regulator.js

node ayurveda_onboard_lab_overseer.js


# Verify wallet contents
ls -la wallet/
```

## Start Application

```bash
# Start the Express server
node app.js

# The server should start on port 5000
# You should see: "Ayurveda Supply Chain server is running on port 5000"
```

## Testing Commands

### 1. Basic Server Test

```bash
# Check server status
curl http://localhost:5000/status
```

### 2. User Login Tests

```bash
# Test all user types
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"userId": "Regulator01"}'
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"userId": "Farmer01"}'
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"userId": "Manufacturer01"}'
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"userId": "Laboratory01"}'
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"userId": "LabOverseer01"}'
```

### 3. Complete Supply Chain Test Flow

#### Step 1: Onboard Entities

```bash
# Onboard Farmer
curl -X POST http://localhost:5000/onboardFarmer \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Regulator01",
    "farmerId": "Farmer01",
    "name": "Rajesh Patel",
    "farmLocation": "Wayanad, Kerala"
  }'

# Onboard Manufacturer
curl -X POST http://localhost:5000/onboardManufacturer \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Regulator01",
    "manufacturerId": "Manufacturer01",
    "companyName": "Himalaya Herbal",
    "name": "Dr. Sharma",
    "location": "Bengaluru, Karnataka"
  }'

# Onboard Laboratory
curl -X POST http://localhost:5000/onboardLaboratory \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "LabOverseer01",
    "laboratoryId": "Laboratory01",
    "labName": "Quality Testing Lab",
    "location": "Mumbai, Maharashtra",
    "accreditation": "NABL-17025-2024",
    "certifications": ["ISO-17025", "AYUSH-QC"]
  }'
```

#### Step 2: Create Herb Batch

```bash
curl -X POST http://localhost:5000/createHerbBatch \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Farmer01",
    "batchId": "BATCH-ASH-001",
    "herbName": "Ashwagandha",
    "harvestDate": "2024-11-15",
    "farmLocation": "Wayanad, Kerala",
    "quantity": "250kg",
    "gpsCoordinates": {
      "latitude": 11.6854,
      "longitude": 76.1320
    },
    "collectorId": "Farmer01",
    "environmentalData": {
      "temperature": "28°C",
      "humidity": "75%",
      "soilType": "Red laterite soil"
    }
  }'
```

#### Step 3: Add Quality Tests

```bash
# Moisture Test
curl -X POST http://localhost:5000/addQualityTest \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Laboratory01",
    "batchId": "BATCH-ASH-001",
    "labId": "Laboratory01",
    "testType": "moisture",
    "testResults": {
      "moisture": 10.5,
      "pesticide": 0.2,
      "purity": 96.5,
      "heavyMetals": 0.1
    },
    "testDate": "2024-11-18",
    "certification": "NABL-QC-12345",
    "labLocation": "Mumbai Laboratory"
  }'

# Pesticide Test
curl -X POST http://localhost:5000/addQualityTest \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Laboratory01",
    "batchId": "BATCH-ASH-001",
    "labId": "Laboratory01",
    "testType": "pesticide",
    "testResults": {
      "moisture": 10.5,
      "pesticide": 0.15,
      "purity": 96.8,
      "organochlorines": 0.02,
      "organophosphates": 0.08
    },
    "testDate": "2024-11-19",
    "certification": "NABL-PEST-12346",
    "labLocation": "Mumbai Laboratory"
  }'
```

#### Step 4: Add Processing Step

```bash
curl -X POST http://localhost:5000/addProcessingStep \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Manufacturer01",
    "batchId": "BATCH-ASH-001",
    "processingType": "drying",
    "processingDate": "2024-11-20",
    "processingLocation": "Bengaluru Processing Unit",
    "processingConditions": {
      "temperature": 45,
      "duration": 72,
      "method": "solar_drying"
    },
    "outputMetrics": {
      "yield": "200kg",
      "moisture_after": 8.5,
      "quality_grade": "Premium"
    },
    "equipmentUsed": "Solar Dryer SD-500",
    "operatorId": "OP-001"
  }'
```

#### Step 5: Transfer Batch

```bash
curl -X POST http://localhost:5000/transferBatch \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Farmer01",
    "batchId": "BATCH-ASH-001",
    "toEntityId": "Manufacturer01",
    "transferReason": "Sale for processing"
  }'
```

#### Step 6: Create Medicine

```bash
curl -X POST http://localhost:5000/createMedicine \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Manufacturer01",
    "medicineId": "MED-ASHWA-001",
    "medicineName": "Ashwagandha Capsules",
    "batchIds": ["BATCH-ASH-001"],
    "manufacturingDate": "2024-11-25",
    "expiryDate": "2026-11-25"
  }'
```

### 4. Consumer Information (Complete Traceability)

```bash
# Get complete consumer information
curl -X POST http://localhost:5000/getConsumerInfo \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Regulator01",
    "medicineId": "MED-ASHWA-001"
  }' | jq '.'
```

### 5. Query Operations

```bash
# Get batch details
curl -X POST http://localhost:5000/getBatchDetails \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Regulator01",
    "batchId": "BATCH-ASH-001"
  }' | jq '.'

# Get medicine details
curl -X POST http://localhost:5000/getMedicineDetails \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Regulator01",
    "medicineId": "MED-ASHWA-001"
  }' | jq '.'

# Track supply chain
curl -X POST http://localhost:5000/trackSupplyChain \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Regulator01",
    "itemId": "MED-ASHWA-001"
  }' | jq '.'

# Get batches by farmer
curl -X POST http://localhost:5000/getBatchesByFarmer \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Regulator01",
    "farmerId": "Farmer01"
  }' | jq '.'

# Get complete ledger (Regulator only)
curl -X POST http://localhost:5000/fetchLedger \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Regulator01"
  }' | jq '.'
```

### 6. Advanced Testing Scenarios

#### Test Different Herbs

```bash
# Create Turmeric batch (valid season)
curl -X POST http://localhost:5000/createHerbBatch \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Farmer01",
    "batchId": "BATCH-TUR-001",
    "herbName": "Turmeric",
    "harvestDate": "2024-10-15",
    "farmLocation": "Mysuru, Karnataka",
    "quantity": "300kg",
    "gpsCoordinates": {
      "latitude": 12.2958,
      "longitude": 76.6394
    },
    "environmentalData": {
      "temperature": "26°C",
      "humidity": "68%",
      "soilType": "Black cotton soil"
    }
  }'

# Test Turmeric quality
curl -X POST http://localhost:5000/addQualityTest \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Laboratory01",
    "batchId": "BATCH-TUR-001",
    "labId": "Laboratory01",
    "testType": "curcumin",
    "testResults": {
      "moisture": 9.2,
      "pesticide": 0.25,
      "purity": 98.5,
      "curcumin": 6.8
    },
    "testDate": "2024-11-20",
    "certification": "NABL-CUR-001",
    "labLocation": "Mumbai Laboratory"
  }'
```

#### Test Multi-Batch Medicine

```bash
# Create second batch (Neem)
curl -X POST http://localhost:5000/createHerbBatch \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Farmer01",
    "batchId": "BATCH-NEEM-001",
    "herbName": "Neem",
    "harvestDate": "2024-11-10",
    "farmLocation": "Tamil Nadu Herbal Zone",
    "quantity": "200kg",
    "gpsCoordinates": {
      "latitude": 11.1271,
      "longitude": 78.6569
    },
    "environmentalData": {
      "temperature": "32°C",
      "humidity": "65%",
      "soilType": "Red soil"
    }
  }'

# Add quality test for Neem
curl -X POST http://localhost:5000/addQualityTest \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Laboratory01",
    "batchId": "BATCH-NEEM-001",
    "labId": "Laboratory01",
    "testType": "purity",
    "testResults": {
      "moisture": 11.0,
      "pesticide": 0.08,
      "purity": 91.5
    },
    "testDate": "2024-11-21",
    "certification": "NABL-NEEM-001",
    "labLocation": "Mumbai Laboratory"
  }'

# Create complex medicine
curl -X POST http://localhost:5000/createMedicine \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Manufacturer01",
    "medicineId": "MED-COMPLEX-001",
    "medicineName": "Immunity Booster Complex",
    "batchIds": ["BATCH-ASH-001", "BATCH-TUR-001", "BATCH-NEEM-001"],
    "manufacturingDate": "2024-12-01",
    "expiryDate": "2026-12-01"
  }'

# Get consumer info for complex medicine
curl -X POST http://localhost:5000/getConsumerInfo \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Regulator01",
    "medicineId": "MED-COMPLEX-001"
  }' | jq '.'
```

### 7. Error Testing

#### Test Invalid GPS Coordinates
```bash
curl -X POST http://localhost:5000/createHerbBatch \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Farmer01",
    "batchId": "BATCH-INVALID-GPS",
    "herbName": "Ashwagandha",
    "harvestDate": "2024-11-15",
    "farmLocation": "Invalid Location",
    "quantity": "100kg",
    "gpsCoordinates": {
      "latitude": 25.0000,
      "longitude": 80.0000
    },
    "environmentalData": {
      "temperature": "28°C",
      "humidity": "75%",
      "soilType": "Unknown"
    }
  }'
```

#### Test Invalid Season
```bash
curl -X POST http://localhost:5000/createHerbBatch \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Farmer01",
    "batchId": "BATCH-INVALID-SEASON",
    "herbName": "Brahmi",
    "harvestDate": "2024-11-15",
    "farmLocation": "Wayanad, Kerala",
    "quantity": "100kg",
    "gpsCoordinates": {
      "latitude": 11.6854,
      "longitude": 76.1320
    },
    "environmentalData": {
      "temperature": "28°C",
      "humidity": "75%",
      "soilType": "Test soil"
    }
  }'
```

#### Test Quality Failure
```bash
curl -X POST http://localhost:5000/addQualityTest \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "Laboratory01",
    "batchId": "BATCH-ASH-001",
    "labId": "Laboratory01",
    "testType": "pesticide_high",
    "testResults": {
      "moisture": 8.5,
      "pesticide": 0.8,
      "purity": 98.0
    },
    "testDate": "2024-11-22",
    "certification": "FAIL-PEST-001",
    "labLocation": "Mumbai Laboratory"
  }'
```

## Automated Testing


## API Endpoints

### User Management
- `POST /registerFarmer` - Register new farmer
- `POST /registerManufacturer` - Register new manufacturer  
- `POST /registerLaboratory` - Register new laboratory
- `POST /login` - User authentication

### Entity Onboarding
- `POST /onboardFarmer` - Onboard farmer (regulator only)
- `POST /onboardManufacturer` - Onboard manufacturer (regulator only)
- `POST /onboardLaboratory` - Onboard laboratory (lab overseer only)

### Supply Chain Operations
- `POST /createHerbBatch` - Create herb batch (farmer only)
- `POST /addQualityTest` - Add quality test results (laboratory only)
- `POST /addProcessingStep` - Add processing step (manufacturer only)
- `POST /transferBatch` - Transfer batch ownership
- `POST /createMedicine` - Create final medicine (manufacturer only)

### Query Operations
- `POST /getConsumerInfo` - Get complete supply chain info (all users)
- `POST /getBatchDetails` - Get batch details
- `POST /getMedicineDetails` - Get medicine details
- `POST /getBatchesByFarmer` - Get all batches by farmer
- `POST /trackSupplyChain` - Track supply chain for item
- `POST /queryHistoryOfAsset` - Get asset history
- `POST /fetchLedger` - Get complete ledger (regulator only)

## Project Structure

```
blockchain-workspace/
├── fabric-samples/
│   ├── test-network/
│   └── ayurveda-chaincode/
│       ├── lib/
│       │   └── ehrChainCode.js
│       ├── package.json
│       └── index.js
└── ayurveda-app/
    ├── wallet/
    ├── app.js
    ├── helper.js
    ├── invoke.js
    ├── query.js
    ├── ayurveda_admin_reg.js
    ├── ayurveda_admin_org2.js
    ├── ayurveda_onboard_*.js
    ├── test_supply_chain.sh
    └── package.json
```

## Troubleshooting

### Network Issues
```bash
# Clean up and restart network
cd fabric-samples/test-network
./network.sh down
docker system prune -a
./network.sh up createChannel -ca
./network.sh deployCC -ccn ehrChainCode -ccp ../ayurveda-chaincode/ -ccl javascript
```

### Wallet Issues
```bash
# Clear and recreate wallets
rm -rf wallet/*
node ayurveda_admin_reg.js
node ayurveda_admin_org2.js
# Re-run all enrollment scripts
```

### Common Errors
- **"Empty string key"**: Make sure you're using correct parameter names (`medicineId` not `batchId` for consumer info)
- **"Batch not found"**: Create the batch first before referencing it
- **"medicine.batchIds is not iterable"**: Use `medicineId` parameter, not `batchId` for `getConsumerInfo`

## Security Features

- **Certificate-based Authentication**: All users have unique X.509 certificates
- **Role-based Access Control**: Operations restricted by user roles
- **Multi-signature Support**: Critical operations require proper authorization
- **Immutable Audit Trail**: All transactions permanently recorded
- **Data Privacy**: Sensitive data properly protected

## Production Considerations

- Use production-grade certificate authorities
- Configure TLS for all communications
- Set up monitoring and logging
- Implement backup strategies
- Use production databases
- Configure load balancing
- Implement proper key management

## License

Apache 2.0

## Support

For issues and questions, refer to the Hyperledger Fabric documentation at https://hyperledger-fabric.readthedocs.io/
