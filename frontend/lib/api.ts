const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface BatchDetails {
  batchId: string
  herbName: string
  harvestDate: string
  farmLocation: string
  quantity: string
  gpsCoordinates: {
    latitude: number
    longitude: number
  }
  qualityStatus: string
  qualityTests: QualityTest[]
  transferHistory: TransferRecord[]
  certifications: any
}

export interface QualityTest {
  id: string
  testType: string
  status: "PASSED" | "FAILED"
  testDate: string
  laboratory: {
    id: string
    location: string
  }
  results: Record<string, number>
  certification: string
}

export interface TransferRecord {
  recordId: string
  occurredDateTime: string
  agent: Array<{
    type: { coding: Array<{ code: string }> }
    who: { reference: string }
  }>
  why: string
}

export interface Medicine {
  medicineId: string
  medicineName: string
  manufacturingDate: string
  expiryDate: string
  manufacturerId: string
  batchIds: string[]
}

export async function fetchLedger(userId: string) {
  const response = await fetch(`${API_BASE_URL}/fetchLedger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  })

  if (!response.ok) throw new Error("Failed to fetch ledger")
  return response.json()
}

export async function getBatchDetails(userId: string, batchId: string): Promise<BatchDetails> {
  const response = await fetch(`${API_BASE_URL}/getBatchDetails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, batchId }),
  })

  if (!response.ok) throw new Error("Failed to get batch details")
  return response.json()
}

export async function getBatchesByFarmer(userId: string, farmerId: string) {
  const response = await fetch(`${API_BASE_URL}/getBatchesByFarmer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, farmerId }),
  })

  if (!response.ok) throw new Error("Failed to get farmer batches")
  return response.json()
}

export async function getConsumerInfo(userId: string, medicineId: string) {
  const response = await fetch(`${API_BASE_URL}/getConsumerInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, medicineId }),
  })

  if (!response.ok) throw new Error("Failed to get consumer info")
  return response.json()
}

export async function createHerbBatch(userId: string, batchData: any) {
  const response = await fetch(`${API_BASE_URL}/createHerbBatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...batchData }),
  })

  if (!response.ok) throw new Error("Failed to create herb batch")
  return response.json()
}

export async function transferBatch(userId: string, batchId: string, toEntityId: string, transferReason: string) {
  const response = await fetch(`${API_BASE_URL}/transferBatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, batchId, toEntityId, transferReason }),
  })

  if (!response.ok) throw new Error("Failed to transfer batch")
  return response.json()
}

export async function addQualityTest(userId: string, testData: any) {
  const response = await fetch(`${API_BASE_URL}/addQualityTest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...testData }),
  })

  if (!response.ok) throw new Error("Failed to add quality test")
  return response.json()
}

export async function createMedicine(userId: string, medicineData: any) {
  const response = await fetch(`${API_BASE_URL}/createMedicine`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...medicineData }),
  })

  if (!response.ok) throw new Error("Failed to create medicine")
  return response.json()
}
