import axios from 'axios'

// API base URL comes from environment. In production, set VITE_API_BASE_URL to your backend URL
// Example: VITE_API_BASE_URL=https://api.your-frontend-domain.com or http://3.27.15.114:5000
// In local dev, you can either set this env var or use a Vite proxy.
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || ''


// Get token from localStorage
const getToken = () => {
  const user = localStorage.getItem('herbAbhilekhUser')
  if (user) {
    const userData = JSON.parse(user)
    return userData.token
  }
  return null
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important for CORS with cookies (refresh token). Required for cross-site cookie send/receive.
  withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error info for debugging in development
    if (typeof window !== 'undefined' && (!import.meta?.env?.PROD)) {
      // eslint-disable-next-line no-console
      console.error('API error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('herbAbhilekhUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API functions
export const authAPI = {
  registerFarmer: (data) => api.post('/auth/register/farmer', data),
  registerManufacturer: (data) => api.post('/auth/register/manufacturer', data),
  registerLaboratory: (data) => api.post('/auth/register/laboratory', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (data) => api.post('/auth/refresh', data),
  logout: (data) => api.post('/auth/logout', data),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.post('/auth/change-password', data),
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