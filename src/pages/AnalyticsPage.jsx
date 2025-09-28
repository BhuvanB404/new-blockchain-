import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  CheckCircle,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { queryAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const AnalyticsPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalBatches: 0,
    totalMedicines: 0,
    totalTests: 0,
    passRate: 0
  })

  // Sample data for charts
  const productionData = [
    { month: 'Jan', batches: 12, medicines: 8 },
    { month: 'Feb', batches: 19, medicines: 15 },
    { month: 'Mar', batches: 15, medicines: 12 },
    { month: 'Apr', batches: 25, medicines: 20 },
    { month: 'May', batches: 22, medicines: 18 },
    { month: 'Jun', batches: 30, medicines: 25 },
    { month: 'Jul', batches: 28, medicines: 22 },
    { month: 'Aug', batches: 35, medicines: 28 },
    { month: 'Sep', batches: 32, medicines: 26 },
    { month: 'Oct', batches: 28, medicines: 23 },
    { month: 'Nov', batches: 24, medicines: 19 },
    { month: 'Dec', batches: 31, medicines: 24 }
  ]

  const qualityData = [
    { name: 'Passed', value: 220, color: '#2d5a27' },
    { name: 'Failed', value: 14, color: '#dc3545' },
    { name: 'Pending', value: 8, color: '#ffc107' }
  ]

  const herbDistributionData = [
    { name: 'Ashwagandha', quantity: 450 },
    { name: 'Turmeric', quantity: 380 },
    { name: 'Neem', quantity: 320 },
    { name: 'Brahmi', quantity: 280 },
    { name: 'Tulsi', quantity: 250 },
    { name: 'Amla', quantity: 200 }
  ]

  const supplyChainData = [
    { name: 'Collection', score: 95 },
    { name: 'Quality Testing', score: 88 },
    { name: 'Processing', score: 92 },
    { name: 'Packaging', score: 90 },
    { name: 'Distribution', score: 85 },
    { name: 'Retail', score: 87 }
  ]

  const recentActivities = [
    {
      timestamp: '2024-12-15 14:30:00',
      activity: 'Herb Batch Created',
      user: 'Farmer01',
      details: 'BATCH-ASH-001 - Ashwagandha',
      status: 'Success'
    },
    {
      timestamp: '2024-12-15 13:45:00',
      activity: 'Quality Test Added',
      user: 'Laboratory01',
      details: 'Pesticide test for BATCH-TUR-001',
      status: 'Success'
    },
    {
      timestamp: '2024-12-15 12:20:00',
      activity: 'Processing Step Added',
      user: 'Manufacturer01',
      details: 'Drying process for BATCH-NEEM-001',
      status: 'Success'
    },
    {
      timestamp: '2024-12-15 11:15:00',
      activity: 'Medicine Created',
      user: 'Manufacturer01',
      details: 'MED-COMPLEX-001 - Immunity Booster',
      status: 'Success'
    },
    {
      timestamp: '2024-12-15 10:30:00',
      activity: 'Batch Transfer',
      user: 'Farmer01',
      details: 'BATCH-ASH-001 transferred to Manufacturer01',
      status: 'Success'
    }
  ]

  useEffect(() => {
    // Only regulators can hit the protected /fetchLedger endpoint.
    // For other roles, show the mock data without calling the API to avoid a 401 redirect.
    if (user && user.role === 'regulator') {
      loadAnalytics()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Load complete ledger data
      const ledgerResponse = await queryAPI.fetchLedger({})
      
      if (ledgerResponse.data.success) {
        const ledgerData = ledgerResponse.data.data
        
        // Calculate metrics from ledger data
        const batches = ledgerData.filter(item => item.type === 'batch')
        const medicines = ledgerData.filter(item => item.type === 'medicine')
        const tests = ledgerData.filter(item => item.type === 'qualityTest')
        
        setMetrics({
          totalBatches: batches.length,
          totalMedicines: medicines.length,
          totalTests: tests.length,
          passRate: tests.length > 0 ? (tests.filter(t => t.status === 'passed').length / tests.length) * 100 : 0
        })
        
        toast.success('Analytics data loaded successfully!')
      } else {
        throw new Error(ledgerResponse.data.message || 'Failed to load analytics')
      }
      
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error(`Error loading analytics: ${error.response?.data?.message || error.message}`)
      
      // Fallback to mock data
      setMetrics({
        totalBatches: 0,
        totalMedicines: 0,
        totalTests: 0,
        passRate: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = () => {
    // Implementation for PDF export
    console.log('Exporting to PDF...')
  }

  const exportToExcel = () => {
    // Implementation for Excel export
    console.log('Exporting to Excel...')
  }

  const exportToCSV = () => {
    // Implementation for CSV export
    console.log('Exporting to CSV...')
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
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
                Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Comprehensive insights into your supply chain performance
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                disabled={!user || user.role !== 'regulator'}
                onClick={() => user && user.role === 'regulator' && loadAnalytics()}
                className="btn-ghost flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="btn-ghost flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Role notice */}
        {user && user.role !== 'regulator' && (
          <div className="mb-6 p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800">
            You are viewing a limited analytics preview. Sign in as a regulator to load live ledger-backed analytics.
          </div>
        )}

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: Package, label: 'Total Batches', value: metrics.totalBatches, color: 'from-blue-500 to-blue-600' },
            { icon: BarChart3, label: 'Medicines Created', value: metrics.totalMedicines, color: 'from-green-500 to-green-600' },
            { icon: CheckCircle, label: 'Quality Tests', value: metrics.totalTests, color: 'from-purple-500 to-purple-600' },
            { icon: TrendingUp, label: 'Pass Rate', value: `${metrics.passRate}%`, color: 'from-orange-500 to-orange-600' }
          ].map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} className="card hover:shadow-strong transition-all duration-300">
                <div className="flex items-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center mr-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Production Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Production Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="batches" stroke="#2d5a27" strokeWidth={2} name="Batches" />
                <Line type="monotone" dataKey="medicines" stroke="#4a7c59" strokeWidth={2} name="Medicines" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quality Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quality Test Results</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={qualityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Herb Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Herb Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={herbDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#2d5a27" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Supply Chain Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Supply Chain Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={supplyChainData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#2d5a27" fill="#2d5a27" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <div className="flex items-center space-x-2">
              <button className="btn-ghost p-2">
                <Filter className="w-4 h-4" />
              </button>
              <button className="btn-ghost p-2">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Activity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">{activity.timestamp}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{activity.activity}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{activity.user}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{activity.details}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="card text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
          <p className="text-gray-600 mb-6">Download comprehensive reports in various formats</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={exportToPDF}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={exportToExcel}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={exportToCSV}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsPage
