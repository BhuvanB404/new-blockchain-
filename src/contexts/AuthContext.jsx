import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

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

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      // Backend returns shape: { success, statusCode, message, data: { userId, email, role, accessToken, refreshToken, profile } }
      const payload = response?.data?.data || {}
      const userData = {
        userId: payload.userId,
        role: payload.role || 'user',
        name: payload.profile?.name || email,
        email: payload.email || email,
        token: payload.accessToken, // Store access token
        refreshToken: payload.refreshToken
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
      let response
      switch (userData.role) {
        case 'farmer':
          response = await authAPI.registerFarmer(userData)
          break
        case 'manufacturer':
          response = await authAPI.registerManufacturer(userData)
          break
        case 'laboratory':
          response = await authAPI.registerLaboratory(userData)
          break
        default:
          throw new Error('Invalid role. Only farmer, manufacturer and laboratory roles are allowed.')
      }
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = async () => {
    try {
      const saved = localStorage.getItem('herbAbhilekhUser')
      const currentUser = saved ? JSON.parse(saved) : null
      if (currentUser?.refreshToken) {
        await authAPI.logout({ refreshToken: currentUser.refreshToken })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during logout:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('herbAbhilekhUser')
    }
  }

  const refresh = async () => {
    try {
      const saved = localStorage.getItem('herbAbhilekhUser')
      const currentUser = saved ? JSON.parse(saved) : null
      if (currentUser && currentUser.refreshToken) {
        const response = await authAPI.refresh({ refreshToken: currentUser.refreshToken })
        // Backend returns: { success, statusCode, message, data: { accessToken, refreshToken } }
        const payload = response?.data?.data || {}
        const updatedUser = {
          ...currentUser,
          token: payload.accessToken || currentUser.token,
          refreshToken: payload.refreshToken || currentUser.refreshToken
        }
        setUser(updatedUser)
        localStorage.setItem('herbAbhilekhUser', JSON.stringify(updatedUser))
        return { success: true, data: response.data }
      }
    } catch (error) {
      await logout() // If refresh fails, logout the user
      return { success: false, error: error.response?.data?.message || 'Session expired' }
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword({ oldPassword, newPassword })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Password change failed' }
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    refresh,
    changePassword,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}