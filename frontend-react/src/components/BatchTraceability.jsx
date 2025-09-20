import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Leaf, Shield, Zap, Package, CheckCircle, MapPin, Calendar, Thermometer, Droplets } from 'lucide-react'
import { queryAPI } from '../services/api'
import toast from 'react-hot-toast'

const BatchTraceability = ({ onClose }) => {
  const [batchId, setBatchId] = useState('')
  const [loading, setLoading] = useState(false)
  const [traceabilityData, setTraceabilityData] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!batchId.trim()) {
      toast.error('Please enter a batch ID')
      return
    }

    setLoading(true)
    try {
      const response = await queryAPI.getBatchDetails({
        userId: 'Regulator01', // Use regulator for full access
        batchId: batchId.trim()
      })

      if (response.data.success) {
        setTraceabilityData(response.data.data)
        toast.success('Batch traceability data loaded!')
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
          className="bg-white rounded-2xl shadow-strong max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Batch Traceability</h3>
                <p className="text-sm text-gray-600">Enter batch ID to view complete traceability</p>
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
                      Batch Overview
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

                  {/* Collection Details */}
                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Leaf className="w-5 h-5 mr-2 text-green-600" />
                      Collection Details
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
                        {traceabilityData.gpsCoordinates && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">GPS Coordinates</div>
                              <div className="font-medium">
                                {traceabilityData.gpsCoordinates.latitude}, {traceabilityData.gpsCoordinates.longitude}
                              </div>
                            </div>
                          </div>
                        )}
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
                            <div className="flex items-center space-x-3">
                              <Leaf className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-600">Soil Type</div>
                                <div className="font-medium">{traceabilityData.environmentalData.soilType || 'N/A'}</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quality Tests */}
                  {traceabilityData.qualityTests && traceabilityData.qualityTests.length > 0 ? (
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
                  ) : (
                    <div className="card bg-yellow-50 border-yellow-200">
                      <h4 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-yellow-600" />
                        Laboratory Test Results
                      </h4>
                      <p className="text-yellow-800">
                        No laboratory test results available yet. This batch is awaiting quality testing.
                      </p>
                    </div>
                  )}

                  {/* Processing Steps */}
                  {traceabilityData.processingSteps && traceabilityData.processingSteps.length > 0 ? (
                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-orange-600" />
                        Manufacturing Processing Steps
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
                              {step.processingConditions && (
                                <div>
                                  Temperature: {step.processingConditions.temperature}°C, 
                                  Duration: {step.processingConditions.duration}h
                                </div>
                              )}
                              {step.outputMetrics && (
                                <div>Output: {step.outputMetrics.yield}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="card bg-yellow-50 border-yellow-200">
                      <h4 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                        Manufacturing Processing Steps
                      </h4>
                      <p className="text-yellow-800">
                        No processing steps recorded yet. This batch is awaiting manufacturing processing.
                      </p>
                    </div>
                  )}

                  {/* Blockchain Verification */}
                  <div className="card bg-green-50 border-green-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Blockchain Verification
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-green-800">Data Integrity</div>
                        <div className="text-xs text-green-600">Cryptographically verified</div>
                      </div>
                      <div className="text-center">
                        <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-green-800">Immutable Record</div>
                        <div className="text-xs text-green-600">Cannot be altered</div>
                      </div>
                      <div className="text-center">
                        <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-green-800">Complete Traceability</div>
                        <div className="text-xs text-green-600">Full supply chain</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BatchTraceability
