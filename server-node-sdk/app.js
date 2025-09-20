'use strict';

const express = require('express');
const helper = require('./helper');
const invoke = require('./invoke');
const query = require('./query');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.listen(5000, function () {
    console.log('Ayurveda Supply Chain server is running on port 5000 :) ');
});

app.get('/status', async function (req, res, next) {
    res.send("Ayurveda Supply Chain server is up.");
})

// Register and onboard farmer in one step
app.post('/registerFarmer', async function (req, res, next) {
    try {
        let { adminId, userId, name, farmLocation, contact, certifications, documentCids } = req.body;

        if (!userId || !adminId || !name || !farmLocation) {
            throw new Error("Missing required farmer details: adminId, userId, name, farmLocation");
        }

        const role = 'farmer';
        const result = await helper.registerAndOnboardUser(adminId, userId, role, { 
            name, 
            farmLocation, 
            contact, 
            certifications, 
            documentCids 
        }, 'Org1');
        
        res.status(result.statusCode).send(result);
    } catch (error) {
        console.log("Error registering farmer: ", error);
        next(error);
    }
});

// Register and onboard manufacturer in one step
app.post('/registerManufacturer', async function (req, res, next) {
    try {
        let { adminId, userId, companyName, name, location, licenses, contact, documentCids } = req.body;

        if (!userId || !adminId || !companyName || !name || !location) {
            throw new Error("Missing required manufacturer details: adminId, userId, companyName, name, location");
        }

        const role = 'manufacturer';
        const result = await helper.registerAndOnboardUser(adminId, userId, role, { 
            companyName, 
            name, 
            location, 
            licenses, 
            contact, 
            documentCids 
        }, 'Org1');
        
        res.status(result.statusCode).send(result);
    } catch (error) {
        console.log("Error registering manufacturer: ", error);
        next(error);
    }
});

// Register and onboard laboratory in one step (Org2)
app.post('/registerLaboratory', async function (req, res, next) {
    try {
        let { adminId, userId, labName, location, accreditation, certifications, contact, documentCids } = req.body;

        if (!userId || !adminId || !labName || !location) {
            throw new Error("Missing required laboratory details: adminId, userId, labName, location");
        }

        const role = 'laboratory';
        const result = await helper.registerAndOnboardUser(adminId, userId, role, { 
            labName, 
            location, 
            accreditation, 
            certifications, 
            contact, 
            documentCids 
        }, 'Org2');
        
        res.status(result.statusCode).send(result);
    } catch (error) {
        console.log("Error registering laboratory: ", error);
        next(error);
    }
});

// Login user
app.post('/login', async function (req, res, next){
    try {
        const { userId } = req.body;

        if (!userId) {
            throw new Error("Missing user ID.");
        }

        const result = await helper.login(userId);
        res.status(result.statusCode).send(result);
    } catch (error) {
        console.log("Error during login: ", error);
        next(error);
    }
});

// Create herb batch (by farmer) - Updated with new fields
app.post('/createHerbBatch', async function (req, res, next){
    try {
        const {
            userId,
            batchId,
            herbName,
            scientificName,
            harvestDate,
            farmLocation,
            quantity,
            unit,
            gpsCoordinates,
            collectorId,
            environmentalData,
            cultivationMethod,
            harvestMethod,
            plantPart,
            images,
            documentCids
        } = req.body;

        // Validate required fields
        if (!userId || !batchId || !herbName || !harvestDate || !farmLocation || !quantity || !gpsCoordinates) {
            throw new Error("Missing required batch creation fields");
        }

        // Validate GPS coordinates
        if (!gpsCoordinates.latitude || !gpsCoordinates.longitude) {
            throw new Error("GPS coordinates must include latitude and longitude");
        }

        const result = await invoke.invokeTransaction('createHerbBatch', {
            batchId,
            herbName,
            scientificName,
            harvestDate,
            farmLocation,
            quantity,
            unit: unit || 'kg',
            gpsCoordinates,
            collectorId,
            environmentalData,
            cultivationMethod,
            harvestMethod,
            plantPart,
            images,
            documentCids
        }, userId);
        
        res.send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Add quality test (by laboratory from Org2) - Updated with new fields
app.post('/addQualityTest', async function (req, res, next){
    try {
        const {
            userId,
            batchId,
            labId,
            testType,
            testResults,
            testDate,
            certification,
            labLocation,
            testStatus, // "PASS" or "FAIL"
            testMethod,
            equipmentUsed,
            observations,
            images,
            documentCids
        } = req.body;

        // Validate required fields
        if (!userId || !batchId || !labId || !testType || !testDate || !testStatus) {
            throw new Error("Missing required quality test fields");
        }

        // Validate test status
        if (!['PASS', 'FAIL'].includes(testStatus)) {
            throw new Error("Test status must be either 'PASS' or 'FAIL'");
        }

        const result = await invoke.invokeTransaction('addQualityTest', {
            batchId,
            labId,
            testType,
            testResults,
            testDate,
            certification,
            labLocation,
            testStatus,
            testMethod,
            equipmentUsed,
            observations,
            images,
            documentCids
        }, userId);
        
        res.send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Add processing step (by manufacturer/processor) - Updated with new fields
app.post('/addProcessingStep', async function (req, res, next){
    try {
        const {
            userId,
            batchId,
            processingType,
            processingDate,
            processingLocation,
            inputQuantity,
            outputQuantity,
            processingDetails,
            equipmentUsed,
            operatorId,
            temperature,
            duration,
            additionalParameters,
            images,
            notes,
            documentCids
        } = req.body;

        // Validate required fields
        if (!userId || !batchId || !processingType || !processingDate || !processingLocation) {
            throw new Error("Missing required processing step fields");
        }

        const result = await invoke.invokeTransaction('addProcessingStep', {
            batchId,
            processingType,
            processingDate,
            processingLocation,
            inputQuantity,
            outputQuantity,
            processingDetails,
            equipmentUsed,
            operatorId,
            temperature,
            duration,
            additionalParameters,
            images,
            notes,
            documentCids
        }, userId);
        
        res.send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Transfer batch - Updated with new fields
app.post('/transferBatch', async function (req, res, next){
    try {
        const { userId, batchId, toEntityId, transferReason, transferLocation, documents, documentCids } = req.body;
        
        if (!userId || !batchId || !toEntityId) {
            throw new Error("Missing required transfer fields: userId, batchId, toEntityId");
        }

        const result = await invoke.invokeTransaction('transferBatch', { 
            batchId, 
            toEntityId, 
            transferReason,
            transferLocation,
            documents,
            documentCids
        }, userId);
        
        res.send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Create medicine (by manufacturer) - Updated with new fields
app.post('/createMedicine', async function (req, res, next){
    try {
        const { 
            userId, 
            medicineId, 
            medicineName, 
            batchIds, 
            manufacturingDate, 
            expiryDate,
            dosageForm,
            strength,
            packagingDetails,
            storageConditions,
            batchNumber,
            regulatoryApprovals,
            documentCids
        } = req.body;
        
        // Validate required fields
        if (!userId || !medicineId || !medicineName || !batchIds || !manufacturingDate || !expiryDate) {
            throw new Error("Missing required medicine creation fields");
        }

        if (!Array.isArray(batchIds) || batchIds.length === 0) {
            throw new Error("batchIds must be a non-empty array");
        }

        const result = await invoke.invokeTransaction('createMedicine', { 
            medicineId, 
            medicineName, 
            batchIds, 
            manufacturingDate, 
            expiryDate,
            dosageForm,
            strength,
            packagingDetails,
            storageConditions,
            batchNumber,
            regulatoryApprovals,
            documentCids
        }, userId);
        
        res.send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Consumer verification - get complete supply chain info
app.post('/getConsumerInfo', async function (req, res, next){
    try {
        const { userId, medicineId } = req.body;
        
        if (!medicineId) {
            throw new Error("Missing medicineId");
        }
        
        const result = await query.getQuery('getConsumerInfo', { medicineId }, userId || 'consumer');
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Get batch details
app.post('/getBatchDetails', async function (req, res, next){
    try {
        const { userId, batchId } = req.body;
        
        if (!batchId) {
            throw new Error("Missing batchId");
        }
        
        const result = await query.getQuery('getBatchDetails', { batchId }, userId);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Get medicine details
app.post('/getMedicineDetails', async function (req, res, next){
    try {
        const { userId, medicineId } = req.body;
        
        if (!medicineId) {
            throw new Error("Missing medicineId");
        }
        
        const result = await query.getQuery('getMedicineDetails', { medicineId }, userId);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Get batches by farmer
app.post('/getBatchesByFarmer', async function (req, res, next){
    try {
        const { userId, farmerId } = req.body;
        
        if (!farmerId) {
            throw new Error("Missing farmerId");
        }
        
        const result = await query.getQuery('getBatchesByFarmer', { farmerId }, userId);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Track supply chain
app.post('/trackSupplyChain', async function (req, res, next){
    try {
        const { userId, itemId } = req.body;
        
        if (!itemId) {
            throw new Error("Missing itemId");
        }
        
        const result = await query.getQuery('trackSupplyChain', { itemId }, userId);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Query history of asset
app.post('/queryHistoryOfAsset', async function (req, res, next){
    try {
        let { userId, assetId } = req.body;
        
        if (!assetId) {
            throw new Error("Missing assetId");
        }

        const result = await query.getQuery('queryHistoryOfAsset', { assetId }, userId);
        
        // Try to parse the result data if it's a string
        try {
            const parsedData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
            res.status(200).send(parsedData);
        } catch (parseError) {
            res.status(200).send({ success: true, data: result });
        }
    } catch (error) {
        next(error);
    }
});

// Fetch ledger (regulator only)
app.post('/fetchLedger', async function (req, res, next){
    try {
        let { userId } = req.body;
        
        if (!userId) {
            throw new Error("Missing userId");
        }
        
        const result = await query.getQuery('fetchLedger', {}, userId);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Legacy endpoints for backward compatibility - now use chaincode directly
app.post('/onboardManufacturer', async function (req, res, next){
    try {
        const { userId, manufacturerId, companyName, name, location, licenses, contact, documentCids } = req.body;
        
        if (!userId || !manufacturerId || !companyName || !name || !location) {
            throw new Error("Missing required fields for manufacturer onboarding");
        }
        
        const result = await invoke.invokeTransaction('onboardManufacturer', { 
            manufacturerId, 
            companyName, 
            name, 
            location,
            licenses,
            contact,
            documentCids
        }, userId);
        
        res.send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

app.post('/onboardFarmer', async function (req, res, next){
    try {
        const { userId, farmerId, name, farmLocation, contact, certifications, documentCids } = req.body;
        
        if (!userId || !farmerId || !name || !farmLocation) {
            throw new Error("Missing required fields for farmer onboarding");
        }
        
        const result = await invoke.invokeTransaction('onboardFarmer', { 
            farmerId, 
            name, 
            farmLocation,
            contact,
            certifications,
            documentCids
        }, userId);
        
        res.send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

app.post('/onboardLaboratory', async function (req, res, next){
    try {
        const { userId, laboratoryId, labName, location, accreditation, certifications, contact, documentCids } = req.body;
        
        if (!userId || !laboratoryId || !labName || !location) {
            throw new Error("Missing required fields for laboratory onboarding");
        }
        
        const result = await invoke.invokeTransaction('onboardLaboratory', { 
            laboratoryId, 
            labName, 
            location, 
            accreditation, 
            certifications,
            contact,
            documentCids
        }, userId);
        
        res.send({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(400).send({
        success: false,
        message: err.message
    });
})

module.exports = app;