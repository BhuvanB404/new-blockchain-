import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Leaf, Shield, FlaskConical, MapPin, Calendar, Thermometer, Droplets, CheckCircle, Plus, Building2 } from 'lucide-react'
import { queryAPI } from '../services/api'
import { normalizeBatchDetails } from '../services/transform'

import toast from 'react-hot-toast'
import ProcessingForm from './forms/ProcessingForm'
import CreateMedicineForm from './forms/CreateMedicineForm'

const ManufacturerWorkflow = ({ onClose }) => {
  const [batchId, setBatchId] = useState('')
  const [loading, setLoading] = useState(false)
  const [traceabilityData, setTraceabilityData] = useState(null)
  const [showProcessingForm, setShowProcessingForm] = useState(false)
  const [showMedicineForm, setShowMedicineForm] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!batchId.trim()) {
      toast.error('Please enter a batch ID')
      return
    }

    setLoading(true)
    try {
      const response = await queryAPI.getBatchDetails({
        batchId: batchId.trim()
      })

      if (response.data.success) {
        const normalized = normalizeBatchDetails(response.data.data)
        setTraceabilityData(normalized)
        toast.success('Complete batch details loaded! You can now add processing details.')
      } else {
        throw new Error(response.data.message || 'Batch not found')
      }
    } catch (error) {
      toast.error(`Error loading batch: ${error.response?.data?.message || error.message}`)
      setTraceabilityData(null)
    } finally {
      setLoading(false)
    }
  }

  const resetSearch = () => {
    setBatchId('')
    setTraceabilityData(null)
    setShowProcessingForm(false)
    setShowMedicineForm(false)
  }

  const handleProcessingSubmit = () => {
    setShowProcessingForm(false)
    toast.success('Processing details added successfully!')
  }

  const handleMedicineSubmit = () => {
    setShowMedicineForm(false)
    toast.success('Medicine created successfully!')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-strong max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Manufacturer Workflow</h3>
                <p className="text-sm text-gray-600">View complete herb details and add processing information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="input"
                    placeholder="Enter Batch ID (e.g., BATCH-ASH-001)"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </button>
                {traceabilityData && (
                  <button
                    type="button"
                    onClick={resetSearch}
                    className="btn-secondary"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>

            {/* Traceability Results */}
            <AnimatePresence>
              {traceabilityData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-6"
                >
                  {/* Batch Overview */}
                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Leaf className="w-5 h-5 mr-2 text-green-600" />
                      Herb Batch Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">Batch ID</div>
                        <div className="text-lg font-semibold text-green-800">{traceabilityData.batchId || 'N/A'}</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">Herb Name</div>
                        <div className="text-lg font-semibold text-blue-800">{traceabilityData.herbName || 'N/A'}</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-600 font-medium">Quantity</div>
                        <div className="text-lg font-semibold text-purple-800">{traceabilityData.quantity || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Farmer Details */}
                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Leaf className="w-5 h-5 mr-2 text-green-600" />
                      Farmer Collection Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Farm Location</div>
                            <div className="font-medium">{traceabilityData.farmLocation || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Harvest Date</div>
                            <div className="font-medium">{traceabilityData.harvestDate || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {traceabilityData.environmentalData && (
                          <>
                            <div className="flex items-center space-x-3">
                              <Thermometer className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-600">Temperature</div>
                                <div className="font-medium">{traceabilityData.environmentalData.temperature || 'N/A'}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Droplets className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-600">Humidity</div>
                                <div className="font-medium">{traceabilityData.environmentalData.humidity || 'N/A'}</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Laboratory Test Results */}
                  {traceabilityData.qualityTests && traceabilityData.qualityTests.length > 0 && (
                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                        Laboratory Test Results
                      </h4>
                      <div className="space-y-4">
                        {traceabilityData.qualityTests.map((test, index) => (
                          <div key={index} className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-blue-900">{test.testType || 'Quality Test'}</div>
                              <div className="text-sm text-blue-600">{test.testDate || 'N/A'}</div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              {test.testResults && Object.entries(test.testResults).map(([key, value]) => (
                                <div key={key}>
                                  <div className="text-blue-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                  <div className="font-medium text-blue-800">{value}</div>
                                </div>
                              ))}
                            </div>
                            {test.certification && (
                              <div className="mt-2 text-xs text-blue-600">
                                Certification: {test.certification}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processing Steps */}
                  {traceabilityData.processingSteps && traceabilityData.processingSteps.length > 0 && (
                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FlaskConical className="w-5 h-5 mr-2 text-orange-600" />
                        Previous Processing Steps
                      </h4>
                      <div className="space-y-4">
                        {traceabilityData.processingSteps.map((step, index) => (
                          <div key={index} className="bg-orange-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-orange-900">{step.processingType || 'Processing Step'}</div>
                              <div className="text-sm text-orange-600">{step.processingDate || 'N/A'}</div>
                            </div>
                            <div className="text-sm text-orange-700">
                              <div>Location: {step.processingLocation || 'N/A'}</div>
                              {typeof step.inputQuantity !== 'undefined' && (
                                <div>Input Quantity: {step.inputQuantity}</div>
                              )}
                              {typeof step.outputQuantity !== 'undefined' && (
                                <div>Output Quantity: {step.outputQuantity}</div>
                              )}
                              {step.processingConditions && (
                                <div>
                                  Temperature: {step.processingConditions.temperature}°C, 
                                  Duration: {step.processingConditions.duration}h
                                </div>
                              )}
                              {step.equipmentUsed && (
                                <div>Equipment: {step.equipmentUsed}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
{/* Action Buttons */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="card bg-blue-50 border-blue-200">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
          <FlaskConical className="w-5 h-5 mr-2" />
          Add Processing Step
        </h4>
        <p className="text-blue-700">
          Record your processing activities and conditions.
        </p>
      </div>
      <button
        onClick={() => setShowProcessingForm(true)}
        className="btn-primary flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Processing</span>
      </button>
    </div>
  </div>

  <div className="card bg-green-50 border-green-200">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Create Medicine
        </h4>
        <p className="text-green-700">
          Create final medicine products from processed herbs.
        </p>
      </div>
      <button
        onClick={() => setShowMedicineForm(true)}
        className="btn-primary flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Create Medicine</span>
      </button>
    </div>
  </div>
</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Processing Form Modal */}
            {showProcessingForm && (
              <ProcessingForm 
                onClose={() => setShowProcessingForm(false)}
                batchId={batchId}
              />
            )}

            {/* Medicine Form Modal */}
            {showMedicineForm && (
              <CreateMedicineForm 
                onClose={() => setShowMedicineForm(false)}
              />
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ManufacturerWorkflow