import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supplyChainAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AppendDataForm = ({ onClose, batchId }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batchId: batchId || '',
    dataType: 'qualityTest',
    notes: '',
    // Quality Test Fields
    labId: user?.userId || '',
    testType: '',
    testResults: '',
    testDate: '',
    testStatus: 'PENDING',
    testMethod: '',
    equipmentUsed: '',
    observations: '',
    certification: '',
    // Processing Step Fields
    processingType: '',
    processingDate: '',
    processingLocation: '',
    inputQuantity: '',
    outputQuantity: '',
    temperature: '',
    duration: ''
  })

  const dataTypes = [
    { value: 'qualityTest', label: 'Quality Test' },
    { value: 'processing', label: 'Processing Step' }
  ]

  const testStatuses = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PASS', label: 'Pass' },
    { value: 'FAIL', label: 'Fail' }
  ]

  const testTypes = [
    { value: 'moisture', label: 'Moisture Content' },
    { value: 'pesticide', label: 'Pesticide Residue' },
    { value: 'purity', label: 'Purity Analysis' },
    { value: 'microbial', label: 'Microbial Testing' },
    { value: 'heavyMetals', label: 'Heavy Metals' },
    { value: 'curcumin', label: 'Curcumin (for Turmeric)' }
  ]

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
      let response;
      
      // Call appropriate API based on data type
      if (formData.dataType === 'qualityTest') {
        // Validate required fields for quality test
        if (!formData.batchId || !formData.labId || !formData.testType || 
            !formData.testResults || !formData.testDate || !formData.testStatus ||
            !formData.testMethod || !formData.equipmentUsed) {
          throw new Error('Please fill in all required fields for quality test')
        }
        
        const testData = {
          batchId: formData.batchId,
          labId: formData.labId,
          testType: formData.testType,
          testResults: formData.testResults,
          testDate: formData.testDate,
          testStatus: formData.testStatus,
          testMethod: formData.testMethod,
          equipmentUsed: formData.equipmentUsed,
          observations: formData.observations || undefined,
          certification: formData.certification || undefined
        }

        response = await supplyChainAPI.addQualityTest(testData)
      } else if (formData.dataType === 'processing') {
        // Validate required fields for processing step
        if (!formData.batchId || !formData.processingType || !formData.processingDate ||
            !formData.processingLocation || !formData.inputQuantity || !formData.outputQuantity ||
            !formData.temperature || !formData.duration || !formData.equipmentUsed) {
          throw new Error('Please fill in all required fields for processing step')
        }
        
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

        response = await supplyChainAPI.addProcessingStep(processingData)
      }

      if (response && response.data.success) {
        toast.success('Data appended successfully!')
        onClose()
      } else {
        throw new Error(response?.data?.message || 'Failed to append data')
      }
    } catch (error) {
      toast.error(`Error appending data: ${error.response?.data?.message || error.message}`)
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
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Append Data to Batch</h3>
          <p className="text-sm text-gray-600">Add new information to this herb batch</p>
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

        {/* Data Type */}
        <div>
          <label className="label">Data Type *</label>
          <select
            name="dataType"
            value={formData.dataType}
            onChange={handleChange}
            className="input"
            required
          >
            {dataTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Fields based on Data Type */}
        {formData.dataType === 'qualityTest' && (
          <>
            {/* Quality Test Specific Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div className="md:col-span-2">
                <label className="label">Certification Number (Optional)</label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., NABL-QC-12345"
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
          </>
        )}

        {formData.dataType === 'processing' && (
          <>
            {/* Processing Specific Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="e.g., Processing facility"
                  required
                />
              </div>
              
              <div>
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
            </div>
          </>
        )}

        {/* Notes */}
        <div>
          <label className="label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input"
            placeholder="Additional notes about this data..."
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
            {loading ? 'Appending Data...' : 'Append Data'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default AppendDataForm