import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Zap } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supplyChainAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ProcessingForm = ({ onClose, batchId }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batchId: batchId || '',
    processingType: '',
    processingDate: '',
    processingLocation: '',
    inputQuantity: '',
    outputQuantity: '',
    temperature: '',
    duration: '',
    equipmentUsed: ''
  })

  const processingTypes = [
    { value: 'drying', label: 'Drying' },
    { value: 'grinding', label: 'Grinding' },
    { value: 'extraction', label: 'Extraction' },
    { value: 'filtration', label: 'Filtration' },
    { value: 'concentration', label: 'Concentration' },
    { value: 'packaging', label: 'Packaging' }
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
      const processingData = {
        batchId: formData.batchId,
        processingType: formData.processingType,
        processingDate: formData.processingDate,
        processingLocation: formData.processingLocation,
        inputQuantity: parseFloat(formData.inputQuantity),
        outputQuantity: parseFloat(formData.outputQuantity),
        temperature: parseFloat(formData.temperature),
        duration: parseFloat(formData.duration),
        equipmentUsed: formData.equipmentUsed
      }

      const response = await supplyChainAPI.addProcessingStep(processingData)
      
      if (response.data.success) {
        toast.success('Processing step added successfully!')
        onClose()
      } else {
        throw new Error(response.data.message || 'Failed to add processing step')
      }
    } catch (error) {
      toast.error(`Error adding processing step: ${error.response?.data?.message || error.message}`)
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
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Add Processing Step</h3>
            <p className="text-sm text-gray-600">Record processing activities and conditions</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Batch ID *</label>
            <input
              type="text"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              className="input"
              placeholder="e.g., BATCH-ASH-001"
              required
              disabled={batchId}
            />
          </div>

          <div>
            <label className="label">Processing Type *</label>
            <select
              name="processingType"
              value={formData.processingType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Processing Type</option>
              {processingTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Processing Date *</label>
            <input
              type="date"
              name="processingDate"
              value={formData.processingDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Processing Location *</label>
            <input
              type="text"
              name="processingLocation"
              value={formData.processingLocation}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Bengaluru Processing Unit"
              required
            />
          </div>

          {/* Quantity Fields */}
          <div>
            <label className="label">Input Quantity *</label>
            <input
              type="number"
              name="inputQuantity"
              value={formData.inputQuantity}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 250"
              step="any"
              required
            />
          </div>

          <div>
            <label className="label">Output Quantity *</label>
            <input
              type="number"
              name="outputQuantity"
              value={formData.outputQuantity}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 200"
              step="any"
              required
            />
          </div>

          {/* Temperature and Duration */}
          <div>
            <label className="label">Temperature (°C) *</label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 45"
              step="any"
              required
            />
          </div>

          <div>
            <label className="label">Duration (hours) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 72"
              step="any"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Equipment Used *</label>
            <input
              type="text"
              name="equipmentUsed"
              value={formData.equipmentUsed}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Solar dryer model SD-2000"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding Processing...' : 'Add Processing'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default ProcessingForm