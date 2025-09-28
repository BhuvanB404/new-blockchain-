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
    name: '',
    location: '',
    email: '',
    contact: '',
    companyName: '',
    labName: '',
    licenses: [],
    certifications: [],
    accreditation: {
      isoCertified: false,
      certificationNumber: ''
    }
  })

  const entityTypes = [
    { value: 'farmer', label: 'Farmer' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'laboratory', label: 'Laboratory' }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let endpoint = ''
      let onboardData = {
        entityId: formData.entityId,
        name: formData.name,
        location: formData.location,
        email: formData.email,
        contact: formData.contact || undefined
      }

      // Add role-specific fields
      if (formData.entityType === 'farmer') {
        onboardData.farmLocation = formData.location
        onboardData.certifications = formData.certifications.length > 0 ? formData.certifications : undefined
      } else if (formData.entityType === 'manufacturer') {
        onboardData.companyName = formData.companyName
        onboardData.licenses = formData.licenses.length > 0 ? formData.licenses : []
      } else if (formData.entityType === 'laboratory') {
        onboardData.labName = formData.labName
        onboardData.accreditation = formData.accreditation
        onboardData.certifications = formData.certifications.length > 0 ? formData.certifications : []
      }

      let response;
      switch (formData.entityType) {
        case 'farmer':
          response = await supplyChainAPI.onboardFarmer(onboardData)
          break
        case 'manufacturer':
          response = await supplyChainAPI.onboardManufacturer(onboardData)
          break
        case 'laboratory':
          response = await supplyChainAPI.onboardLaboratory(onboardData)
          break
        default:
          throw new Error('Invalid entity type selected')
      }

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
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input"
              placeholder="Enter location"
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
              placeholder="Enter contact information"
            />
          </div>

          {/* Role-specific fields */}
          {formData.entityType === 'manufacturer' && (
            <div className="md:col-span-2">
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

          {formData.entityType === 'laboratory' && (
            <>
              <div className="md:col-span-2">
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
            </>
          )}
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