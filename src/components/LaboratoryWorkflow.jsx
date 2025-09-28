import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Leaf, Shield, FlaskConical, MapPin, Calendar, Thermometer, Droplets, Plus, FilePlus } from 'lucide-react'
import { queryAPI } from '../services/api'
import toast from 'react-hot-toast'
import QualityTestForm from './forms/QualityTestForm'
import AppendDataForm from './forms/AppendDataForm'
import { useAuth } from '../contexts/AuthContext'
import { normalizeBatchDetails } from '../services/transform'

const LaboratoryWorkflow = ({ onClose }) => {
  const { user } = useAuth()
  const [batchId, setBatchId] = useState('')
  const [loading, setLoading] = useState(false)
  const [traceabilityData, setTraceabilityData] = useState(null)
  const [showQualityTestForm, setShowQualityTestForm] = useState(false)
  const [showAppendDataForm, setShowAppendDataForm] = useState(false)

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
        toast.success('Batch details loaded! You can now add quality test results or append data.')
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
    setShowQualityTestForm(false)
    setShowAppendDataForm(false)
  }

  const handleQualityTestSubmit = () => {
    setShowQualityTestForm(false)
    setTraceabilityData(null)
    toast.success('Quality test results added successfully!')
  }

  const handleAppendDataSubmit = () => {
    setShowAppendDataForm(false)
    setTraceabilityData(null)
    toast.success('Data appended successfully!')
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Laboratory Workflow</h3>
                <p className="text-sm text-gray-600">View farmer details and add quality test results</p>
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
            {traceabilityData && (
              <div className="space-y-6">
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

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Add Quality Test Button */}
                    <div className="card bg-purple-50 border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
                            <FlaskConical className="w-5 h-5 mr-2" />
                            Quality Testing
                          </h4>
                          <p className="text-purple-700">
                            Add quality test results for this batch.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowQualityTestForm(true)}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Test</span>
                        </button>
                      </div>
                    </div>

                    {/* Append Data Button */}
                    <div className="card bg-blue-50 border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                            <FilePlus className="w-5 h-5 mr-2" />
                            Append Data
                          </h4>
                          <p className="text-blue-700">
                            Add additional information or observations to this batch.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowAppendDataForm(true)}
                          className="btn-secondary flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Append</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Existing Quality Tests */}
                  {traceabilityData.qualityTests && traceabilityData.qualityTests.length > 0 && (
                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        Previous Quality Test Results
                      </h4>
                      <div className="space-y-4">
                        {traceabilityData.qualityTests.map((test, index) => (
                          <div key={index} className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-blue-900 flex items-center gap-2">
                                {test.testType || 'Quality Test'}
                                {test.testStatus && (
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${test.testStatus === 'PASS' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                    {test.testStatus}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-blue-600">{test.testDate || 'N/A'}</div>
                            </div>
                            {test.testResults && test.testResults.summary ? (
                              <div className="text-sm text-blue-900">{test.testResults.summary}</div>
                            ) : (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                {test.testResults && Object.entries(test.testResults).map(([key, value]) => (
                                  <div key={key}>
                                    <div className="text-blue-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                    <div className="font-medium text-blue-800">{value}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="mt-2 text-xs text-blue-700 space-y-1">
                              {test.testMethod && <div>Method: {test.testMethod}</div>}
                              {test.equipmentUsed && <div>Equipment: {test.equipmentUsed}</div>}
                              {test.certification && <div>Certification: {test.certification}</div>}
                              {test.observations && <div>Note: {test.observations}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Quality Test Form Modal */}
            {showQualityTestForm && (
              <QualityTestForm 
                onClose={() => setShowQualityTestForm(false)}
                batchId={batchId}
              />
            )}
            {/* Append Data Form Modal */}
            {showAppendDataForm && (
              <AppendDataForm 
                onClose={() => setShowAppendDataForm(false)}
                batchId={batchId}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LaboratoryWorkflow