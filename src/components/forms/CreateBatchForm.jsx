import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, MapPin, Calendar, Package, Leaf } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supplyChainAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateBatchForm = ({ onClose }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batchId: '',
    herbName: '',
    scientificName: '',
    harvestDate: '',
    farmLocation: '',
    quantity: '',
    unit: '',
    latitude: '',
    longitude: '',
    collectorId: user?.userId || '',
    cultivationMethod: '',
    harvestMethod: '',
    plantPart: ''
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
      const batchData = {
        batchId: formData.batchId,
        herbName: formData.herbName,
        scientificName: formData.scientificName,
        harvestDate: formData.harvestDate,
        farmLocation: formData.farmLocation,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        gpsCoordinates: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        },
        collectorId: formData.collectorId,
        cultivationMethod: formData.cultivationMethod,
        harvestMethod: formData.harvestMethod,
        plantPart: formData.plantPart
      }

      const response = await supplyChainAPI.createHerbBatch(batchData)
      
      if (response.data.success) {
        toast.success('Herb batch created successfully!')
        onClose()
      } else {
        throw new Error(response.data.message || 'Failed to create batch')
      }
    } catch (error) {
      toast.error(`Error creating batch: ${error.response?.data?.message || error.message}`)
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
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Create Herb Batch</h3>
            <p className="text-sm text-gray-600">Record new herb collection with GPS coordinates</p>
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

          {/* Herb Name */}
          <div>
            <label className="label">Herb Name *</label>
            <input
              type="text"
              name="herbName"
              value={formData.herbName}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Ashwagandha"
              required
            />
          </div>

          {/* Scientific Name */}
          <div>
            <label className="label">Scientific Name *</label>
            <input
              type="text"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Withania somnifera"
              required
            />
          </div>

          {/* Harvest Date */}
          <div>
            <label className="label">Harvest Date *</label>
            <input
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Farm Location */}
          <div>
            <label className="label">Farm Location *</label>
            <input
              type="text"
              name="farmLocation"
              value={formData.farmLocation}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Wayanad, Kerala"
              required
            />
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 250"
                required
                step="any"
              />
            </div>
            <div>
              <label className="label">Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Unit</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="ton">Tons (ton)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
          </div>

          {/* Collector ID */}
          <div>
            <label className="label">Collector ID *</label>
            <input
              type="text"
              name="collectorId"
              value={formData.collectorId}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Farmer01"
              required
            />
          </div>

          {/* Cultivation Method */}
          <div>
            <label className="label">Cultivation Method *</label>
            <input
              type="text"
              name="cultivationMethod"
              value={formData.cultivationMethod}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Organic farming"
              required
            />
          </div>

          {/* Harvest Method */}
          <div>
            <label className="label">Harvest Method *</label>
            <input
              type="text"
              name="harvestMethod"
              value={formData.harvestMethod}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Manual harvesting"
              required
            />
          </div>

          {/* Plant Part */}
          <div>
            <label className="label">Plant Part *</label>
            <select
              name="plantPart"
              value={formData.plantPart}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Plant Part</option>
              <option value="root">Root</option>
              <option value="leaf">Leaf</option>
              <option value="stem">Stem</option>
              <option value="flower">Flower</option>
              <option value="seed">Seed</option>
              <option value="fruit">Fruit</option>
              <option value="bark">Bark</option>
              <option value="whole">Whole Plant</option>
            </select>
          </div>

          {/* GPS Coordinates */}
          <div className="md:col-span-2">
            <label className="label">GPS Coordinates *</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 11.6854"
                  step="any"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 76.1320"
                  step="any"
                  required
                />
              </div>
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
            {loading ? 'Creating...' : 'Create Batch'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default CreateBatchForm