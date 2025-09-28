import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { queryAPI } from '../../services/api'
import toast from 'react-hot-toast'

const TrackItemForm = ({ onClose }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    itemId: ''
  })
  const [results, setResults] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResults(null)

    try {
      const trackData = {
        itemId: formData.itemId
      }

      const response = await queryAPI.trackSupplyChain(trackData)
      
      if (response.data.success) {
        setResults(response.data.data)
        toast.success('Item tracked successfully!')
      } else {
        throw new Error(response.data.message || 'Failed to track item')
      }
    } catch (error) {
      toast.error(`Error tracking item: ${error.response?.data?.message || error.message}`)
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
            <Search className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Track Supply Chain</h3>
            <p className="text-sm text-gray-600">Track any item through the complete supply chain</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Item ID (Medicine ID or Batch ID) *</label>
          <input
            type="text"
            name="itemId"
            value={formData.itemId}
            onChange={handleChange}
            className="input"
            placeholder="e.g., MED-ASHWA-001 or BATCH-ASH-001"
            required
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Tracking...' : 'Track Item'}
          </button>
        </div>
      </form>

      {results && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Tracking Results</h4>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </motion.div>
  )
}

export default TrackItemForm