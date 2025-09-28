import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supplyChainAPI } from '../../services/api'
import toast from 'react-hot-toast'

const TransferBatchForm = ({ onClose }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batchId: '',
    toEntityId: '',
    transferReason: '',
    transferLocation: ''
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
      const transferData = {
        batchId: formData.batchId,
        toEntityId: formData.toEntityId,
        transferReason: formData.transferReason,
        transferLocation: formData.transferLocation
      }

      const response = await supplyChainAPI.transferBatch(transferData)
      
      if (response.data.success) {
        toast.success('Batch transferred successfully!')
        onClose()
      } else {
        throw new Error(response.data.message || 'Failed to transfer batch')
      }
    } catch (error) {
      toast.error(`Error transferring batch: ${error.response?.data?.message || error.message}`)
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
            <ArrowRight className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Transfer Batch</h3>
            <p className="text-sm text-gray-600">Transfer batch ownership in the supply chain</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
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

          <div>
            <label className="label">Transfer To (Entity ID) *</label>
            <input
              type="text"
              name="toEntityId"
              value={formData.toEntityId}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Manufacturer01"
              required
            />
          </div>

          <div>
            <label className="label">Transfer Reason *</label>
            <input
              type="text"
              name="transferReason"
              value={formData.transferReason}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Sale for processing"
              required
            />
          </div>

          <div>
            <label className="label">Transfer Location *</label>
            <input
              type="text"
              name="transferLocation"
              value={formData.transferLocation}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Processing facility in Mumbai"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Transferring...' : 'Transfer Batch'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default TransferBatchForm