import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, ArrowRight, Eye, EyeOff, User, Building, FlaskConical } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    location: '',
    farmLocation: '',
    companyName: '',
    labName: '',
    contact: '',
    licenses: [],
    certifications: [],
    accreditation: {
      isoCertified: false,
      certificationNumber: ''
    },
    documentCids: []
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const roles = [
    {
      value: 'farmer',
      label: 'Farmer',
      icon: User,
      description: 'Collect and supply herbs'
    },
    {
      value: 'manufacturer',
      label: 'Manufacturer',
      icon: Building,
      description: 'Process herbs and create medicines'
    },
    {
      value: 'laboratory',
      label: 'Laboratory',
      icon: FlaskConical,
      description: 'Conduct quality tests and certifications'
    }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('accreditation.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        accreditation: {
          ...formData.accreditation,
          [field]: field === 'isoCertified' ? checked : value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }
  }

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate role selected
    if (!formData.role) {
      toast.error('Please select a role (Farmer, Manufacturer, or Laboratory)')
      setLoading(false)
      return
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // Prepare registration data based on role
      let registerData = {
        role: formData.role, // Add the role to the registration data
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name,
        location: formData.location,
        contact: formData.contact || undefined,
        documentCids: formData.documentCids.length > 0 ? formData.documentCids : undefined
      }

      // Add role-specific fields
      if (formData.role === 'farmer') {
        registerData.farmLocation = formData.farmLocation
        registerData.certifications = formData.certifications.length > 0 ? formData.certifications : undefined
      } else if (formData.role === 'manufacturer') {
        registerData.companyName = formData.companyName
        registerData.licenses = formData.licenses.length > 0 ? formData.licenses : []
      } else if (formData.role === 'laboratory') {
        registerData.labName = formData.labName
        registerData.accreditation = formData.accreditation
        registerData.certifications = formData.certifications.length > 0 ? formData.certifications : []
      }

      const result = await register(registerData)
      
      if (result.success) {
        toast.success('Registration successful! Please login.')
        navigate('/login')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 font-serif">
            Join Herb Abhilekh
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start your journey towards transparency
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="label">Select Your Role *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleChange(role.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.role === role.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                          formData.role === role.value
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{role.label}</h3>
                        <p className="text-xs text-gray-600">{role.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input pr-10"
                    placeholder="Enter your password"
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters with uppercase, lowercase, number, and special character
                </p>
              </div>

              <div>
                <label className="label">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="Enter your location"
                required
              />
            </div>

            <div>
              <label className="label">Contact (Optional)</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="input"
                placeholder="Enter your contact information"
              />
            </div>

            {/* Role-specific fields */}
            {formData.role === 'farmer' && (
              <div>
                <label className="label">Farm Location *</label>
                <input
                  type="text"
                  name="farmLocation"
                  value={formData.farmLocation}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your farm location"
                  required
                />
              </div>
            )}

            {formData.role === 'manufacturer' && (
              <div>
                <label className="label">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter company name"
                  required
                />
              </div>
            )}

            {formData.role === 'laboratory' && (
              <>
                <div>
                  <label className="label">Laboratory Name *</label>
                  <input
                    type="text"
                    name="labName"
                    value={formData.labName}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter laboratory name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">ISO Certified</label>
                    <input
                      type="checkbox"
                      name="accreditation.isoCertified"
                      checked={formData.accreditation.isoCertified}
                      onChange={handleChange}
                      className="input"
                    />
                    <span className="ml-2 text-gray-700">Yes, ISO Certified</span>
                  </div>
                  <div>
                    <label className="label">Certification Number</label>
                    <input
                      type="text"
                      name="accreditation.certificationNumber"
                      value={formData.accreditation.certificationNumber}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter certification number"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center"
              disabled={loading || !formData.role}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RegisterPage