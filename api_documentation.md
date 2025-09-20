# Ayurveda Supply Chain API Documentation

## Overview

This API provides secure authentication and supply chain management for the Ayurveda industry, integrating JWT-based authentication with Hyperledger Fabric blockchain technology.

**Base URL**: `http://localhost:5000`

## Table of Contents

- [Authentication System](#authentication-system)
- [User Registration](#user-registration)
- [Login & Token Management](#login--token-management)
- [Protected Endpoints](#protected-endpoints)
- [Supply Chain Operations](#supply-chain-operations)
- [Query Operations](#query-operations)
- [Error Handling](#error-handling)
- [Client Examples](#client-examples)

---

## Authentication System

### JWT Token Structure

The system uses two types of tokens:

1. **Access Token** (15 minutes expiry)
   - Used for API authentication
   - Contains user info: userId, role, email, deviceInfo
   - Format: `Bearer <access_token>`

2. **Refresh Token** (7 days expiry)
   - Used to obtain new access tokens
   - Stored securely and can be invalidated

### Token Example Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "userId": "farmer_1758389674138_fb14a40a",
    "email": "farmer@example.com",
    "role": "farmer",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "profile": {
      "name": "John",
      "farmLocation": "Kerala",
      "contact": "",
      "certifications": [],
      "documentCids": []
    }
  }
}
```

---

## User Registration

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

### 1. Register Farmer

**Endpoint**: `POST /auth/register/farmer`

**Request Body**:
```json
{
  "email": "farmer@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "name": "John Smith",
  "farmLocation": "Kerala, India",
  "contact": "+91-9876543210",
  "certifications": ["Organic Farming Certificate"],
  "documentCids": [],
  "deviceInfo": {
    "type": "mobile",
    "platform": "iOS"
  }
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/auth/register/farmer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "name": "John Smith",
    "farmLocation": "Kerala, India"
  }'
```

**Success Response**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User registered successfully",
  "data": {
    "userId": "farmer_1758389674138_fb14a40a",
    "email": "farmer@example.com",
    "role": "farmer",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "fabricRegistration": {
      "statusCode": 200,
      "message": "Successfully registered and onboarded farmer user",
      "chaincodeOnboarding": {
        "resourceType": "Bundle",
        "timestamp": "2025-09-20T17:34:34.000Z"
      }
    }
  }
}
```

### 2. Register Manufacturer  

**Endpoint**: `POST /auth/register/manufacturer`

**Request Body**:
```json
{
  "email": "manufacturer@example.com", 
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "companyName": "Ayurveda Pharma Ltd",
  "name": "Jane Smith",
  "location": "Mumbai, India",
  "licenses": ["Drug Manufacturing License"],
  "contact": "+91-9876543210",
  "documentCids": []
}
```

### 3. Register Laboratory

**Endpoint**: `POST /auth/register/laboratory`

**Request Body**:
```json
{
  "email": "lab@example.com",
  "password": "SecurePass123!", 
  "confirmPassword": "SecurePass123!",
  "labName": "Quality Testing Lab",
  "location": "Bangalore, India",
  "accreditation": {
    "isoCertified": true,
    "certificationNumber": "ISO17025"
  },
  "certifications": ["NABL Accredited"],
  "contact": "+91-9876543210"
}
```

**Success Response Example**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User registered successfully",
  "data": {
    "userId": "laboratory_1758390038336_723bd9d7",
    "email": "lab@example.com",
    "role": "laboratory",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "fabricRegistration": {
      "statusCode": 200,
      "chaincodeOnboarding": {
        "resourceType": "Bundle",
        "entry": [
          {
            "resource": {
              "resourceType": "Organization",
              "name": "Quality Testing Lab",
              "address": [{"text": "Bangalore, India"}],
              "type": [{"coding": [{"code": "laboratory"}]}]
            }
          }
        ]
      }
    }
  }
}
```

---

## Login & Token Management

### 1. User Login

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "farmer@example.com",
  "password": "SecurePass123!",
  "deviceInfo": {
    "type": "mobile", 
    "platform": "iOS"
  }
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@example.com","password":"SecurePass123!"}'
```

**Success Response**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "userId": "farmer_1758389674138_fb14a40a",
    "email": "farmer@example.com",
    "role": "farmer",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "profile": {
      "name": "John",
      "farmLocation": "Kerala",
      "contact": "",
      "certifications": [],
      "documentCids": []
    }
  }
}
```

**Error Response (Invalid Credentials)**:
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### 2. Refresh Token

**Endpoint**: `POST /auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Logout

**Endpoint**: `POST /auth/logout`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Get User Profile

**Endpoint**: `GET /auth/profile`

**Headers**: `Authorization: Bearer <access_token>`

**cURL Example**:
```bash
curl -X GET http://localhost:5000/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 5. Change Password

**Endpoint**: `POST /auth/change-password`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "oldPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

---

## Protected Endpoints

All supply chain operations require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Supply Chain Operations

### 1. Create Herb Batch (Farmer Only)

**Endpoint**: `POST /createHerbBatch`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "batchId": "BATCH001",
  "herbName": "Turmeric",
  "scientificName": "Curcuma longa",
  "harvestDate": "2024-03-15",
  "farmLocation": "Kerala Farm", 
  "quantity": 100,
  "unit": "kg",
  "gpsCoordinates": {
    "latitude": 10.1632,
    "longitude": 76.6413
  },
  "collectorId": "farmer_1758389674138_fb14a40a",
  "cultivationMethod": "Organic",
  "harvestMethod": "Hand-picked",
  "plantPart": "Rhizome"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/createHerbBatch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "batchId": "BATCH001",
    "herbName": "Turmeric",
    "scientificName": "Curcuma longa",
    "harvestDate": "2024-03-15",
    "farmLocation": "Kerala Farm",
    "quantity": 100,
    "unit": "kg",
    "gpsCoordinates": {
      "latitude": 10.1632,
      "longitude": 76.6413
    }
  }'
```

### 2. Add Quality Test (Laboratory Only)

**Endpoint**: `POST /addQualityTest`

**Headers**: `Authorization: Bearer <lab_access_token>`

**Request Body**:
```json
{
  "batchId": "BATCH001",
  "labId": "laboratory_1758390038336_723bd9d7",
  "testType": "Purity Test",
  "testResults": "95% pure curcumin content",
  "testDate": "2024-03-20",
  "testStatus": "PASS",
  "testMethod": "HPLC Analysis",
  "equipmentUsed": "Waters HPLC System",
  "observations": "High quality turmeric sample with excellent curcumin content"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/addQualityTest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <lab_token>" \
  -d '{
    "batchId": "BATCH001",
    "labId": "laboratory_1758390038336_723bd9d7",
    "testType": "Purity Test",
    "testDate": "2024-03-20",
    "testStatus": "PASS"
  }'
```

### 3. Add Processing Step (Manufacturer Only)

**Endpoint**: `POST /addProcessingStep`

**Headers**: `Authorization: Bearer <manufacturer_access_token>`

**Request Body**:
```json
{
  "batchId": "BATCH001",
  "processingType": "Drying",
  "processingDate": "2024-03-22",
  "processingLocation": "Mumbai Processing Plant",
  "inputQuantity": 100,
  "outputQuantity": 25,
  "temperature": 60,
  "duration": 24,
  "equipmentUsed": "Industrial Dryer Model XYZ"
}
```

### 4. Transfer Batch

**Endpoint**: `POST /transferBatch`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "batchId": "BATCH001",
  "toEntityId": "manufacturer_123456789",
  "transferReason": "For processing into medicine",
  "transferLocation": "Mumbai, India"
}
```

### 5. Create Medicine (Manufacturer Only)

**Endpoint**: `POST /createMedicine`

**Headers**: `Authorization: Bearer <manufacturer_access_token>`

**Request Body**:
```json
{
  "medicineId": "MED001",
  "medicineName": "Turmeric Plus Capsules",
  "batchIds": ["BATCH001"],
  "manufacturingDate": "2024-04-01",
  "expiryDate": "2026-04-01",
  "dosageForm": "Capsule",
  "strength": "500mg",
  "packagingDetails": "60 capsules per bottle",
  "batchNumber": "TPC240401"
}
```

---

## Query Operations

### 1. Get Consumer Info (Public)

**Endpoint**: `POST /getConsumerInfo`

**Request Body**:
```json
{
  "medicineId": "MED001"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/getConsumerInfo \
  -H "Content-Type: application/json" \
  -d '{"medicineId":"MED001"}'
```

### 2. Get Batch Details (Protected)

**Endpoint**: `POST /getBatchDetails`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "batchId": "BATCH001"
}
```

### 3. Get Medicine Details (Protected)

**Endpoint**: `POST /getMedicineDetails`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "medicineId": "MED001"  
}
```

### 4. Track Supply Chain (Public)

**Endpoint**: `POST /trackSupplyChain`

**Request Body**:
```json
{
  "itemId": "BATCH001"
}
```

### 5. Get Batches by Farmer (Protected)

**Endpoint**: `POST /getBatchesByFarmer`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "farmerId": "farmer_1758389674138_fb14a40a"
}
```

Note: Farmers can only query their own batches unless they have regulator/overseer role.

---

## Error Handling

### Common Error Responses

**Authentication Required (401)**:
```json
{
  "success": false,
  "message": "Access token required"
}
```

**Token Expired (401)**:
```json
{
  "success": false,
  "message": "Token expired",
  "code": "TOKEN_EXPIRED"
}
```

**Insufficient Permissions (403)**:
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**Invalid Input (400)**:
```json
{
  "success": false,
  "message": "Missing required batch creation fields"
}
```

**Rate Limited (429)**:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Role-Based Access Control

| Endpoint | Farmer | Manufacturer | Laboratory | Public |
|----------|---------|--------------|------------|--------|
| `/createHerbBatch` | ✅ | ❌ | ❌ | ❌ |
| `/addQualityTest` | ❌ | ❌ | ✅ | ❌ |
| `/addProcessingStep` | ❌ | ✅ | ❌ | ❌ |
| `/transferBatch` | ✅ | ✅ | ❌ | ❌ |
| `/createMedicine` | ❌ | ✅ | ❌ | ❌ |
| `/getBatchDetails` | ✅ | ✅ | ✅ | ❌ |
| `/getConsumerInfo` | ✅ | ✅ | ✅ | ✅ |
| `/trackSupplyChain` | ✅ | ✅ | ✅ | ✅ |

---

## Client Examples

### JavaScript/Web Client

```javascript
class AyurvedaAPI {
  constructor(baseURL = 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.accessToken = null;
    this.refreshToken = null;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      this.accessToken = data.data.accessToken;
      this.refreshToken = data.data.refreshToken;
    }
    return data;
  }

  async request(endpoint, options = {}) {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.accessToken) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    return await response.json();
  }

  async createHerbBatch(batchData) {
    return this.request('/createHerbBatch', {
      body: JSON.stringify(batchData)
    });
  }
}

// Usage
const api = new AyurvedaAPI();
await api.login('farmer@example.com', 'SecurePass123!');
const result = await api.createHerbBatch({
  batchId: 'BATCH001',
  herbName: 'Turmeric',
  // ... other fields
});
```

### Python Client

```python
import requests
import json

class AyurvedaAPI:
    def __init__(self, base_url='http://localhost:5000'):
        self.base_url = base_url
        self.access_token = None
        self.refresh_token = None

    def login(self, email, password):
        response = requests.post(f'{self.base_url}/auth/login', 
            json={'email': email, 'password': password})
        data = response.json()
        
        if data['success']:
            self.access_token = data['data']['accessToken']
            self.refresh_token = data['data']['refreshToken']
        
        return data

    def request(self, endpoint, method='POST', data=None):
        headers = {'Content-Type': 'application/json'}
        if self.access_token:
            headers['Authorization'] = f'Bearer {self.access_token}'
        
        response = requests.request(method, f'{self.base_url}{endpoint}', 
            headers=headers, json=data)
        return response.json()

# Usage
api = AyurvedaAPI()
login_result = api.login('farmer@example.com', 'SecurePass123!')
batch_result = api.request('/createHerbBatch', data={
    'batchId': 'BATCH001',
    'herbName': 'Turmeric'
})
```

---

## Security Features

1. **Password Hashing**: bcrypt with configurable rounds (default: 12)
2. **JWT Tokens**: Secure access/refresh token system
3. **Rate Limiting**: Protection against brute force attacks
4. **Role-Based Access**: Endpoint access based on user roles
5. **Account Lockout**: Automatic lockout after failed login attempts
6. **CORS Protection**: Configurable allowed origins
7. **Security Headers**: Helmet.js integration
8. **Input Validation**: Comprehensive request validation

---

## Environment Configuration

Create a `.env` file with:

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-minimum-64-characters
JWT_REFRESH_SECRET=your-different-super-secret-refresh-key
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

The system is production-ready with comprehensive security, authentication, and supply chain management capabilities.