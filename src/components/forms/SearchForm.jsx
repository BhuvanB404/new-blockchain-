import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { queryAPI } from '../../services/api'
import toast from 'react-hot-toast'

const SearchForm = ({ onClose }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    query: ''
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
      const query = formData.query
      let searchResults = null

      // Try as medicine ID first
      try {
        const response = await queryAPI.getConsumerInfo({
          medicineId: query
        })
        
        if (response.data.success) {
          searchResults = { type: 'medicine', data: response.data.data }
        }
      } catch (e) {
        // Continue to next search method
      }

      // Try as batch ID if medicine search failed
      if (!searchResults) {
        try {
          const response = await queryAPI.getBatchDetails({
            batchId: query
          })
          
          if (response.data.success) {
            searchResults = { type: 'batch', data: response.data.data }
          }
        } catch (e) {
          // Continue to next search method
        }
      }

      if (searchResults) {
        setResults(searchResults)
        toast.success('Search completed successfully!')
      } else {
        throw new Error('No results found for the search query')
      }
    } catch (error) {
      toast.error(`Search error: ${error.message}`)
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
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Search Products</h3>
            <p className="text-sm text-gray-600">Search for products by ID or name</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Search Query *</label>
          <input
            type="text"
            name="query"
            value={formData.query}
            onChange={handleChange}
            className="input"
            placeholder="Enter Medicine ID, Batch ID, or Herb Name"
            required
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {results && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Search Results ({results.type})
          </h4>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(results.data, null, 2)}
          </pre>
        </div>
      )}
    </motion.div>
  )
}

export default SearchForm