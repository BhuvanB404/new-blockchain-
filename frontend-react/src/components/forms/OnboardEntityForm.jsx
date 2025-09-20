import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supplyChainAPI } from '../../services/api'
import toast from 'react-hot-toast'

const OnboardEntityForm = ({ onClose }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    entityType: '',
    entityId: '',
    entityName: '',
    entityLocation: ''
  })

  const entityTypes = [
    { value: 'farmer', label: 'Farmer' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'laboratory', label: 'Laboratory' }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const onboardData = {
        userId: user.userId,
        [formData.entityType + 'Id']: formData.entityId,
        name: formData.entityName,
        location: formData.entityLocation
      }

      // Add role-specific fields
      if (formData.entityType === 'farmer') {
        onboardData.farmLocation = formData.entityLocation
      } else if (formData.entityType === 'manufacturer') {
        onboardData.companyName = formData.entityName
      } else if (formData.entityType === 'laboratory') {
        onboardData.labName = formData.entityName
        onboardData.accreditation = 'NABL-17025-2024'
        onboardData.certifications = ['ISO-17025', 'AYUSH-QC']
      }

      let endpoint = ''
      switch (formData.entityType) {
        case 'farmer':
          endpoint = '/onboardFarmer'
          break
        case 'manufacturer':
          endpoint = '/onboardManufacturer'
          break
        case 'laboratory':
          endpoint = '/onboardLaboratory'
          break
        default:
          throw new Error('Invalid entity type selected')
      }

      const response = await supplyChainAPI[formData.entityType === 'farmer' ? 'onboardFarmer' : 
                                          formData.entityType === 'manufacturer' ? 'onboardManufacturer' : 
                                          'onboardLaboratory'](onboardData)
      
      if (response.data.success) {
        toast.success('Entity onboarded successfully!')
        onClose()
      } else {
        throw new Error(response.data.message || 'Failed to onboard entity')
      }
    } catch (error) {
      toast.error(`Error onboarding entity: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Onboard New Entity</h3>
            <p className="text-sm text-gray-600">Onboard farmers, manufacturers, and laboratories</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Entity Type *</label>
            <select
              name="entityType"
              value={formData.entityType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Entity Type</option>
              {entityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Entity ID *</label>
            <input
              type="text"
              name="entityId"
              value={formData.entityId}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Farmer01"
              required
            />
          </div>

          <div>
            <label className="label">Name *</label>
            <input
              type="text"
              name="entityName"
              value={formData.entityName}
              onChange={handleChange}
              className="input"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="label">Location *</label>
            <input
              type="text"
              name="entityLocation"
              value={formData.entityLocation}
              onChange={handleChange}
              className="input"
              placeholder="Enter location"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Onboarding...' : 'Onboard Entity'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default OnboardEntityForm
