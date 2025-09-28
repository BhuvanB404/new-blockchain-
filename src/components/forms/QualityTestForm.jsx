import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, FlaskConical } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supplyChainAPI } from '../../services/api'
import toast from 'react-hot-toast'

const QualityTestForm = ({ onClose, batchId }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batchId: batchId || '',
    labId: user?.userId || '',
    testType: '',
    testResults: '',
    testDate: '',
    testStatus: 'PENDING',
    testMethod: '',
    equipmentUsed: '',
    observations: ''
  })

  const testTypes = [
    { value: 'moisture', label: 'Moisture Content' },
    { value: 'pesticide', label: 'Pesticide Residue' },
    { value: 'purity', label: 'Purity Analysis' },
    { value: 'microbial', label: 'Microbial Testing' },
    { value: 'heavyMetals', label: 'Heavy Metals' },
    { value: 'curcumin', label: 'Curcumin (for Turmeric)' }
  ]

  const testStatuses = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PASS', label: 'Pass' },
    { value: 'FAIL', label: 'Fail' }
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
        batchId: formData.batchId,
        labId: formData.labId,
        testType: formData.testType,
        testResults: formData.testResults,
        testDate: formData.testDate,
        testStatus: formData.testStatus,
        testMethod: formData.testMethod,
        equipmentUsed: formData.equipmentUsed,
        observations: formData.observations || undefined
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
              disabled={batchId}
            />
          </div>

          {/* Lab ID */}
          <div>
            <label className="label">Lab ID *</label>
            <input
              type="text"
              name="labId"
              value={formData.labId}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Lab01"
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

          {/* Test Status */}
          <div>
            <label className="label">Test Status *</label>
            <select
              name="testStatus"
              value={formData.testStatus}
              onChange={handleChange}
              className="input"
              required
            >
              {testStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
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

          {/* Test Method */}
          <div>
            <label className="label">Test Method *</label>
            <input
              type="text"
              name="testMethod"
              value={formData.testMethod}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Gravimetric method"
              required
            />
          </div>

          {/* Equipment Used */}
          <div>
            <label className="label">Equipment Used *</label>
            <input
              type="text"
              name="equipmentUsed"
              value={formData.equipmentUsed}
              onChange={handleChange}
              className="input"
              placeholder="e.g., UV-Vis Spectrophotometer"
              required
            />
          </div>
        </div>

        {/* Test Results */}
        <div>
          <label className="label">Test Results *</label>
          <textarea
            name="testResults"
            value={formData.testResults}
            onChange={handleChange}
            className="input"
            placeholder="Enter detailed test results..."
            rows="4"
            required
          />
        </div>

        {/* Observations */}
        <div>
          <label className="label">Observations (Optional)</label>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            className="input"
            placeholder="Any additional observations..."
            rows="3"
          />
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