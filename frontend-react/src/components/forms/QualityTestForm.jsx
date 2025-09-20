import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, FlaskConical } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supplyChainAPI } from '../../services/api'
import toast from 'react-hot-toast'

const QualityTestForm = ({ onClose }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batchId: '',
    testType: '',
    testDate: '',
    moisture: '',
    pesticide: '',
    purity: '',
    certification: ''
  })

  const testTypes = [
    { value: 'moisture', label: 'Moisture' },
    { value: 'pesticide', label: 'Pesticide' },
    { value: 'purity', label: 'Purity' },
    { value: 'curcumin', label: 'Curcumin (for Turmeric)' }
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
      const testData = {
        userId: user.userId,
        batchId: formData.batchId,
        labId: user.userId,
        testType: formData.testType,
        testResults: {
          moisture: parseFloat(formData.moisture),
          pesticide: parseFloat(formData.pesticide),
          purity: parseFloat(formData.purity)
        },
        testDate: formData.testDate,
        certification: formData.certification,
        labLocation: 'Laboratory'
      }

      const response = await supplyChainAPI.addQualityTest(testData)
      
      if (response.data.success) {
        toast.success('Quality test added successfully!')
        onClose()
      } else {
        throw new Error(response.data.message || 'Failed to add quality test')
      }
    } catch (error) {
      toast.error(`Error adding quality test: ${error.response?.data?.message || error.message}`)
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Add Quality Test</h3>
            <p className="text-sm text-gray-600">Record quality test results and certifications</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Batch ID */}
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
            />
          </div>

          {/* Test Type */}
          <div>
            <label className="label">Test Type *</label>
            <select
              name="testType"
              value={formData.testType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Test Type</option>
              {testTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Test Date */}
          <div>
            <label className="label">Test Date *</label>
            <input
              type="date"
              name="testDate"
              value={formData.testDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Certification */}
          <div>
            <label className="label">Certification Number *</label>
            <input
              type="text"
              name="certification"
              value={formData.certification}
              onChange={handleChange}
              className="input"
              placeholder="e.g., NABL-QC-12345"
              required
            />
          </div>
        </div>

        {/* Test Results */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Moisture (%) *</label>
              <input
                type="number"
                name="moisture"
                value={formData.moisture}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 10.5"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="label">Pesticide (ppm) *</label>
              <input
                type="number"
                name="pesticide"
                value={formData.pesticide}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 0.15"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="label">Purity (%) *</label>
              <input
                type="number"
                name="purity"
                value={formData.purity}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 96.8"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding Test...' : 'Add Test'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default QualityTestForm
