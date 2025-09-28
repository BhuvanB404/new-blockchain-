import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Leaf, Shield, Zap, Package, CheckCircle, MapPin, Calendar, Thermometer, Droplets } from 'lucide-react'
import { queryAPI } from '../services/api'
import { normalizeBatchDetails } from '../services/transform'
import toast from 'react-hot-toast'

const BatchTraceability = ({ onClose }) => {
  const [batchId, setBatchId] = useState('')
  const [loading, setLoading] = useState(false)
  const [traceabilityData, setTraceabilityData] = useState(null)
  const [relatedMedicines, setRelatedMedicines] = useState([])
  const [medicineIdInput, setMedicineIdInput] = useState('')

  const fetchMedicineDetails = async () => {
    if (!medicineIdInput.trim()) return
    try {
      const res = await queryAPI.getMedicineDetails({ medicineId: medicineIdInput.trim() })
      const md = res?.data?.data || res?.data
      if (md) {
        // Accept either a single object or wrapped data
        const item = md.medicineId ? md : md.data || md
        setRelatedMedicines((prev) => {
          // Avoid duplicates by medicineId
          const next = [...prev]
          const id = item.medicineId || item.id || medicineIdInput.trim()
          const exists = next.find((m) => (m.medicineId || m.id) === id)
          if (!exists) next.push(item)
          return next
        })
      }
      setMedicineIdInput('')
      toast.success('Medicine details loaded')
    } catch (e) {
      toast.error('Failed to load medicine details')
    }
  }

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
        const normalized = normalizeBatchDetails(response.data.data)
        setTraceabilityData(normalized)
        // Try to discover related medicines via supply chain tracking
        try {
          const tr = await queryAPI.trackSupplyChain({ itemId: batchId.trim() })
          // Attempt common shapes: tr.data.data.medicines or tr.data.data.relatedMedicines
          const meds = tr?.data?.data?.medicines || tr?.data?.data?.relatedMedicines || []
          if (Array.isArray(meds)) setRelatedMedicines(meds)
        } catch (e) {
          // silently ignore if not available
          setRelatedMedicines([])
        }
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
                            {/* IDs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700 mb-2">
                              <div>Batch ID: {test.batchId || traceabilityData.batchId || 'N/A'}</div>
                              <div>Lab ID: {test.labId || 'N/A'}</div>
                            </div>
                            {/* Results */}
                            {test.testResults && test.testResults.summary ? (
                              <div className="text-sm text-blue-900">Result: {test.testResults.summary}</div>
                            ) : (
                              test.testResults && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  {Object.entries(test.testResults).map(([key, value]) => (
                                    <div key={key}>
                                      <div className="text-blue-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                      <div className="font-medium text-blue-800">{String(value)}</div>
                                    </div>
                                  ))}
                                </div>
                              )
                            )}
                            {/* Meta */}
                            <div className="mt-2 text-xs text-blue-700 space-y-1">
                              {test.testMethod && <div>Method: {test.testMethod}</div>}
                              {test.equipmentUsed && <div>Equipment: {test.equipmentUsed}</div>}
                              {test.certification && <div>Certification: {test.certification}</div>}
                              {test.observations && <div>Note: {test.observations}</div>}
                              {Array.isArray(test.images) && test.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {test.images.map((src, i) => (
                                    <img key={i} src={src} alt={`test-${i}`} className="h-12 w-12 object-cover rounded" />
                                  ))}
                                </div>
                              )}
                              {test.reportUrl && (
                                <div>
                                  Report: <a className="text-blue-600 underline" href={test.reportUrl} target="_blank" rel="noreferrer">Open</a>
                                </div>
                              )}
                            </div>
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
                              <div>Batch ID: {step.batchId || 'N/A'}</div>
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

                  {/* Related Medicines */}
                  <div className="card bg-purple-50 border-purple-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-purple-600" />
                      Related Medicines
                    </h4>
                    {relatedMedicines && relatedMedicines.length > 0 ? (
                      <div className="space-y-4 text-purple-900">
                        {relatedMedicines.map((m, idx) => (
                          <div key={idx} className="bg-white/60 border border-purple-200 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold">{m.medicineName || m.name || 'Medicine'}</div>
                              <div className="text-xs text-purple-700">{m.medicineId || m.id}</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              {m.batchIds && (
                                <div>Batch IDs: {Array.isArray(m.batchIds) ? m.batchIds.join(', ') : String(m.batchIds)}</div>
                              )}
                              {m.manufacturingDate && (<div>Manufactured: {m.manufacturingDate}</div>)}
                              {m.expiryDate && (<div>Expiry: {m.expiryDate}</div>)}
                              {m.dosageForm && (<div>Dosage Form: {m.dosageForm}</div>)}
                              {m.strength && (<div>Strength: {m.strength}</div>)}
                              {m.packagingDetails && (<div>Packaging: {m.packagingDetails}</div>)}
                              {m.storageConditions && (<div>Storage: {m.storageConditions}</div>)}
                              {m.batchNumber && (<div>Batch No: {m.batchNumber}</div>)}
                              {m.regulatoryApprovals && (
                                <div>Regulatory: {Array.isArray(m.regulatoryApprovals) ? m.regulatoryApprovals.join(', ') : String(m.regulatoryApprovals)}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <p className="text-purple-800 mb-3">No medicines linked to this batch yet.</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="input flex-1"
                            placeholder="Enter Medicine ID (e.g., MED001)"
                            value={medicineIdInput}
                            onChange={(e) => setMedicineIdInput(e.target.value)}
                          />
                          <button onClick={fetchMedicineDetails} className="btn-primary">Fetch</button>
                        </div>
                      </div>
                    )}
                  </div>

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
