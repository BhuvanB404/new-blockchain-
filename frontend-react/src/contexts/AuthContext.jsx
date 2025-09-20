import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('herbAbhilekhUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (userId) => {
    try {
      const response = await api.post('/login', { userId })
      const userData = {
        userId,
        role: response.data.role || 'user',
        name: response.data.name || userId
      }
      setUser(userData)
      localStorage.setItem('herbAbhilekhUser', JSON.stringify(userData))
      return { success: true, data: userData }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      let endpoint = ''
      switch (userData.role) {
        case 'manufacturer':
          endpoint = '/registerManufacturer'
          break
        case 'laboratory':
          endpoint = '/registerLaboratory'
          break
        default:
          throw new Error('Invalid role. Only manufacturer and laboratory roles are allowed.')
      }

      const response = await api.post(endpoint, userData)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('herbAbhilekhUser')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
