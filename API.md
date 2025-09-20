Of course. Here are the lists of required and optional fields for each function in your chaincode, which can be used to build frontend requests.

***

### ## Absolutely Required Fields

This list contains only the fields that **must be provided** for each transaction to succeed.

---

### **Onboarding Functions**

* **`onboardFarmer`**
    * `farmerId`: Unique identifier for the farmer.
    * `name`: Full name of the farmer.
    * `farmLocation`: Text description of the farm's location.

* **`onboardLaboratory`**
    * `laboratoryId`: Unique identifier for the laboratory.
    * `labName`: Official name of the laboratory.
    * `location`: Text description of the lab's address.
    * `accreditation`: Details of the lab's accreditation.

* **`onboardManufacturer`**
    * `manufacturerId`: Unique identifier for the manufacturer.
    * `companyName`: The legal name of the company.
    * `name`: Name of the primary contact person.
    * `location`: Text description of the manufacturer's address.
    * `licenses`: Information about the manufacturer's licenses.

---

### **Supply Chain Functions**

* **`createHerbBatch`**
    * `batchId`: Unique identifier for this batch.
    * `herbName`: Common name of the herb.
    * `harvestDate`: The date of harvest (ISO 8601 format).
    * `farmLocation`: Location where the herb was harvested.
    * `quantity`: The amount of herb harvested.
    * `gpsCoordinates`: An object containing the GPS data.
        * `gpsCoordinates.latitude`: The latitude.
        * `gpsCoordinates.longitude`: The longitude.

* **`addQualityTest`**
    * `batchId`: The ID of the herb batch being tested.
    * `labId`: The ID of the laboratory performing the test.
    * `testType`: The name or type of the test conducted.
    * `testDate`: The date the test was performed (ISO 8601 format).
    * `testStatus`: The final result, must be `"PASS"` or `"FAIL"`.

* **`addProcessingStep`**
    * `batchId`: The ID of the herb batch being processed.
    * `processingType`: The name of the processing step (e.g., "Drying", "Extraction").
    * `processingDate`: The date of the processing step (ISO 8601 format).
    * `processingLocation`: The location where the processing occurred.

* **`transferBatch`**
    * `batchId`: The ID of the batch being transferred.
    * `toEntityId`: The unique ID of the recipient.
    * `transferReason`: A brief reason for the transfer (e.g., "Sale to Manufacturer").

* **`createMedicine`**
    * `medicineId`: Unique identifier for the final medicine product.
    * `medicineName`: The name of the medicine.
    * `batchIds`: An array of batch IDs used to create the medicine (e.g., `["batch-001", "batch-002"]`).
    * `manufacturingDate`: The date the medicine was manufactured (ISO 8601 format).
    * `expiryDate`: The expiration date of the medicine (ISO 8601 format).

---

### **Query Functions**

* **`getConsumerInfo`**: `medicineId`
* **`getBatchDetails`**: `batchId`
* **`getMedicineDetails`**: `medicineId`
* **`getBatchesByFarmer`**: `farmerId`
* **`trackSupplyChain`**: `itemId` (can be a `batchId` or `medicineId`)
* **`queryHistoryOfAsset`**: `assetId` (can be any ID on the ledger)
* **`fetchLedger`**: No fields required.

***
***

### ## All Fields (Optional Marked)

This is a comprehensive list of all possible fields for each function. Fields marked with `(optional)` are not required for the transaction to be successful.

---

### **Onboarding Functions**

* **`onboardFarmer`**
    * `farmerId`
    * `name`
    * `farmLocation`
    * `contact` (optional)
    * `certifications` (optional)

* **`onboardLaboratory`**
    * `laboratoryId`
    * `labName`
    * `location`
    * `accreditation`
    * `certifications` (optional)
    * `contact` (optional)

* **`onboardManufacturer`**
    * `manufacturerId`
    * `companyName`
    * `name`
    * `location`
    * `licenses`
    * `contact` (optional)

---

### **Supply Chain Functions**

* **`createHerbBatch`**
    * `batchId`
    * `herbName`
    * `harvestDate`
    * `farmLocation`
    * `quantity`
    * `gpsCoordinates` (containing `latitude` and `longitude`)
    * `scientificName` (optional)
    * `unit` (optional, defaults to "kg")
    * `collectorId` (optional, defaults to the transaction submitter's ID)
    * `environmentalData` (optional)
    * `cultivationMethod` (optional)
    * `harvestMethod` (optional)
    * `plantPart` (optional)
    * `images` (optional)

* **`addQualityTest`**
    * `batchId`
    * `labId`
    * `testType`
    * `testDate`
    * `testStatus`
    * `testResults` (optional)
    * `certification` (optional)
    * `labLocation` (optional)
    * `testMethod` (optional)
    * `equipmentUsed` (optional)
    * `observations` (optional)
    * `images` (optional)
    * `reportUrl` (optional)

* **`addProcessingStep`**
    * `batchId`
    * `processingType`
    * `processingDate`
    * `processingLocation`
    * `inputQuantity` (optional)
    * `outputQuantity` (optional)
    * `processingDetails` (optional)
    * `equipmentUsed` (optional)
    * `operatorId` (optional)
    * `temperature` (optional)
    * `duration` (optional)
    * `additionalParameters` (optional)
    * `images` (optional)
    * `notes` (optional)

* **`transferBatch`**
    * `batchId`
    * `toEntityId`
    * `transferReason`
    * `transferLocation` (optional)
    * `documents` (optional)

* **`createMedicine`**
    * `medicineId`
    * `medicineName`
    * `batchIds`
    * `manufacturingDate`
    * `expiryDate`
    * `dosageForm` (optional)
    * `strength` (optional)
    * `packagingDetails` (optional)
    * `storageConditions` (optional)
    * `batchNumber` (optional)
    * `regulatoryApprovals` (optional)
