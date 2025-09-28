import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { 
  QrCode, 
  Plus, 
  BarChart3, 
  Users, 
  Package, 
  FlaskConical,
  Leaf,
  ArrowRight,
  Search,
  Filter,
  Download,
  FilePlus
} from 'lucide-react'
import QRScanner from '../components/QRScanner'
import BatchTraceability from '../components/BatchTraceability'
import LaboratoryWorkflow from '../components/LaboratoryWorkflow'
import ManufacturerWorkflow from '../components/ManufacturerWorkflow'
import CreateBatchForm from '../components/forms/CreateBatchForm'
import QualityTestForm from '../components/forms/QualityTestForm'
import ProcessingForm from '../components/forms/ProcessingForm'
import CreateMedicineForm from '../components/forms/CreateMedicineForm'
import OnboardEntityForm from '../components/forms/OnboardEntityForm'
import TransferBatchForm from '../components/forms/TransferBatchForm'
import TrackItemForm from '../components/forms/TrackItemForm'
import SearchForm from '../components/forms/SearchForm'
import { queryAPI } from '../services/api'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const { user } = useAuth()
  const [activeForm, setActiveForm] = useState(null)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showBatchTraceability, setShowBatchTraceability] = useState(false)
  const [showLaboratoryWorkflow, setShowLaboratoryWorkflow] = useState(false)
  const [showManufacturerWorkflow, setShowManufacturerWorkflow] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = '/login'
    }
  }, [user])

  if (!user) {
    return null
  }

  const getDashboardConfig = () => {
    switch (user.role) {
      case 'manufacturer':
        return {
          title: 'Manufacturer Dashboard',
          subtitle: 'View herb details and add processing information',
          color: 'blue',
          cards: [
            {
              icon: Search,
              title: 'View Herb Details',
              description: 'Scan QR or enter batch ID to see farmer and lab details',
              action: () => setShowManufacturerWorkflow(true),
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: FlaskConical,
              title: 'Add Processing Step',
              description: 'Record processing activities and conditions',
              action: () => setActiveForm('processing'),
              color: 'from-green-500 to-green-600'
            },
            {
              icon: Package,
              title: 'Create Medicine',
              description: 'Create final medicine products',
              action: () => setActiveForm('createMedicine'),
              color: 'from-purple-500 to-purple-600'
            }
          ]
        }
      
      case 'laboratory':
        return {
          title: 'Laboratory Dashboard',
          subtitle: 'View herb details and add quality test results',
          color: 'purple',
          cards: [
            {
              icon: Search,
              title: 'View Herb Details',
              description: 'Scan QR or enter batch ID to see farmer details',
              action: () => setShowLaboratoryWorkflow(true),
              color: 'from-purple-500 to-purple-600'
            },
            {
              icon: FlaskConical,
              title: 'Add Quality Test',
              description: 'Record quality test results and certifications',
              action: () => setActiveForm('qualityTest'),
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: FilePlus,
              title: 'Append Data',
              description: 'Add additional information to existing batches',
              action: () => setShowLaboratoryWorkflow(true),
              color: 'from-green-500 to-green-600'
            }
          ]
        }
      
      case 'regulator':
        return {
          title: 'Regulator Dashboard',
          subtitle: 'Oversee the complete supply chain ecosystem',
          color: 'red',
          cards: [
            {
              icon: Users,
              title: 'Onboard Entities',
              description: 'Onboard farmers, manufacturers, and laboratories',
              action: () => setActiveForm('onboardEntity'),
              color: 'from-red-500 to-red-600'
            },
            {
              icon: Package,
              title: 'Complete Ledger',
              description: 'View the complete blockchain ledger',
              action: () => loadCompleteLedger(),
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: Search,
              title: 'Track Supply Chain',
              description: 'Track any item through the supply chain',
              action: () => setActiveForm('trackItem'),
              color: 'from-green-500 to-green-600'
            },
            {
              icon: BarChart3,
              title: 'System Analytics',
              description: 'Comprehensive system analytics and reporting',
              action: () => window.location.href = '/analytics',
              color: 'from-purple-500 to-purple-600'
            }
          ]
        }
      
      default:
        return {
          title: 'General Dashboard',
          subtitle: 'Access traceability and search features',
          color: 'gray',
          cards: [
            {
              icon: QrCode,
              title: 'Scan QR Code',
              description: 'Scan QR codes to view product traceability',
              action: () => setShowQRScanner(true),
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: Search,
              title: 'Search Products',
              description: 'Search for products by ID or name',
              action: () => setActiveForm('search'),
              color: 'from-green-500 to-green-600'
            }
          ]
        }
    }
  }

  const config = getDashboardConfig()

  const loadFarmerBatches = async () => {
    setLoading(true)
    try {
      const response = await queryAPI.getBatchesByFarmer({
        farmerId: user.userId
      })
      
      if (response.data.success) {
        setDashboardData({ type: 'batches', data: response.data.data })
        toast.success('Farmer batches loaded successfully!')
      } else {
        throw new Error(response.data.message || 'Failed to load batches')
      }
    } catch (error) {
      toast.error(`Error loading batches: ${error.response?.data?.message || error.message}`)
      setDashboardData({ type: 'batches', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const loadTestResults = async () => {
    // Implementation for loading test results
    setDashboardData({ type: 'tests', message: 'Loading test results...' })
  }

  const loadCompleteLedger = async () => {
    setLoading(true)
    try {
      const response = await queryAPI.fetchLedger({})
      
      if (response.data.success) {
        setDashboardData({ type: 'ledger', data: response.data.data })
        toast.success('Complete ledger loaded successfully!')
      } else {
        throw new Error(response.data.message || 'Failed to load ledger')
      }
    } catch (error) {
      toast.error(`Error loading ledger: ${error.response?.data?.message || error.message}`)
      setDashboardData({ type: 'ledger', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const renderForm = () => {
    switch (activeForm) {
      case 'createBatch':
        return <CreateBatchForm onClose={() => setActiveForm(null)} />
      case 'qualityTest':
        return <QualityTestForm onClose={() => setActiveForm(null)} />
      case 'processing':
        return <ProcessingForm onClose={() => setActiveForm(null)} />
      case 'createMedicine':
        return <CreateMedicineForm onClose={() => setActiveForm(null)} />
      case 'onboardEntity':
        return <OnboardEntityForm onClose={() => setActiveForm(null)} />
      case 'transferBatch':
        return <TransferBatchForm onClose={() => setActiveForm(null)} />
      case 'trackItem':
        return <TrackItemForm onClose={() => setActiveForm(null)} />
      case 'search':
        return <SearchForm onClose={() => setActiveForm(null)} />
      default:
        return null
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
                {config.title}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {config.subtitle}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowQRScanner(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Scan QR</span>
              </button>
              
              <button
                onClick={() => setShowBatchTraceability(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Search Batch</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {config.cards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={card.action}
                className="group card hover:shadow-strong transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
                <div className="mt-4 flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
                  <span className="text-sm font-medium">Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Dashboard Data */}
        {dashboardData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {dashboardData.type === 'batches' && 'My Batches'}
                {dashboardData.type === 'tests' && 'Test Results'}
                {dashboardData.type === 'ledger' && 'Complete Ledger'}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="btn-ghost p-2">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="btn-ghost p-2">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-center py-8 text-gray-500">
              {dashboardData.message}
            </div>
          </motion.div>
        )}

        {/* Forms Modal */}
        {activeForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-strong max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {renderForm()}
            </motion.div>
          </div>
        )}

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <QRScanner onClose={() => setShowQRScanner(false)} />
        )}

        {/* Batch Traceability Modal */}
        {showBatchTraceability && (
          <BatchTraceability onClose={() => setShowBatchTraceability(false)} />
        )}

        {/* Laboratory Workflow Modal */}
        {showLaboratoryWorkflow && (
          <LaboratoryWorkflow onClose={() => setShowLaboratoryWorkflow(false)} />
        )}

        {/* Manufacturer Workflow Modal */}
        {showManufacturerWorkflow && (
          <ManufacturerWorkflow onClose={() => setShowManufacturerWorkflow(false)} />
        )}
      </div>
    </div>
  )
}

export default DashboardPage