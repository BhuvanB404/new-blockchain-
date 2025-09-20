import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('herbAbhilekhUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API functions
export const authAPI = {
  login: (userId) => api.post('/login', { userId }),
  registerFarmer: (data) => api.post('/registerFarmer', data),
  registerManufacturer: (data) => api.post('/registerManufacturer', data),
  registerLaboratory: (data) => api.post('/registerLaboratory', data),
}

export const supplyChainAPI = {
  createHerbBatch: (data) => api.post('/createHerbBatch', data),
  addQualityTest: (data) => api.post('/addQualityTest', data),
  addProcessingStep: (data) => api.post('/addProcessingStep', data),
  transferBatch: (data) => api.post('/transferBatch', data),
  createMedicine: (data) => api.post('/createMedicine', data),
  onboardFarmer: (data) => api.post('/onboardFarmer', data),
  onboardManufacturer: (data) => api.post('/onboardManufacturer', data),
  onboardLaboratory: (data) => api.post('/onboardLaboratory', data),
}

export const queryAPI = {
  getConsumerInfo: (data) => api.post('/getConsumerInfo', data),
  getBatchDetails: (data) => api.post('/getBatchDetails', data),
  getMedicineDetails: (data) => api.post('/getMedicineDetails', data),
  getBatchesByFarmer: (data) => api.post('/getBatchesByFarmer', data),
  trackSupplyChain: (data) => api.post('/trackSupplyChain', data),
  fetchLedger: (data) => api.post('/fetchLedger', data),
}
