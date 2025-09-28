import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Package } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supplyChainAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateMedicineForm = ({ onClose }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    medicineId: '',
    medicineName: '',
    batchIds: '',
    manufacturingDate: '',
    expiryDate: '',
    dosageForm: '',
    strength: '',
    packagingDetails: '',
    batchNumber: ''
  })

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
      const medicineData = {
        medicineId: formData.medicineId,
        medicineName: formData.medicineName,
        batchIds: formData.batchIds.split(',').map(id => id.trim()).filter(id => id),
        manufacturingDate: formData.manufacturingDate,
        expiryDate: formData.expiryDate,
        dosageForm: formData.dosageForm,
        strength: formData.strength,
        packagingDetails: formData.packagingDetails,
        batchNumber: formData.batchNumber
      }

      const response = await supplyChainAPI.createMedicine(medicineData)
      
      if (response.data.success) {
        toast.success('Medicine created successfully!')
        onClose()
      } else {
        throw new Error(response.data.message || 'Failed to create medicine')
      }
    } catch (error) {
      toast.error(`Error creating medicine: ${error.response?.data?.message || error.message}`)
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
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Create Medicine</h3>
            <p className="text-sm text-gray-600">Create final medicine products from processed batches</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Medicine ID *</label>
            <input
              type="text"
              name="medicineId"
              value={formData.medicineId}
              onChange={handleChange}
              className="input"
              placeholder="e.g., MED-ASHWA-001"
              required
            />
          </div>

          <div>
            <label className="label">Medicine Name *</label>
            <input
              type="text"
              name="medicineName"
              value={formData.medicineName}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Ashwagandha Capsules"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Batch IDs (comma-separated) *</label>
            <input
              type="text"
              name="batchIds"
              value={formData.batchIds}
              onChange={handleChange}
              className="input"
              placeholder="BATCH-ASH-001, BATCH-TUR-001"
              required
            />
          </div>

          <div>
            <label className="label">Manufacturing Date *</label>
            <input
              type="date"
              name="manufacturingDate"
              value={formData.manufacturingDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Dosage Form *</label>
            <input
              type="text"
              name="dosageForm"
              value={formData.dosageForm}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Capsule, Tablet, Powder"
              required
            />
          </div>

          <div>
            <label className="label">Strength *</label>
            <input
              type="text"
              name="strength"
              value={formData.strength}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 500mg, 1g"
              required
            />
          </div>

          <div>
            <label className="label">Batch Number *</label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              className="input"
              placeholder="e.g., BN-2023-001"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Packaging Details *</label>
            <input
              type="text"
              name="packagingDetails"
              value={formData.packagingDetails}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Bottle of 60 capsules"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Medicine...' : 'Create Medicine'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default CreateMedicineForm