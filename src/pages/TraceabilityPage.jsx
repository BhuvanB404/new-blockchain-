import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  RotateCcw, 
  QrCode, 
  Leaf, 
  Shield, 
  Zap, 
  Package,
  CheckCircle,
  ArrowRight,
  Eye
} from 'lucide-react'
import QRCode from 'qrcode'

const TraceabilityPage = () => {
  const [demoStep, setDemoStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrData, setQrData] = useState('')
  const [showResults, setShowResults] = useState(false)

  const demoSteps = [
    {
      id: 'step1',
      title: 'Collection',
      description: 'Herb batch created with GPS coordinates and environmental data',
      icon: Leaf,
      color: 'from-green-500 to-green-600',
      details: {
        batchId: 'BATCH-ASH-DEMO-001',
        herb: 'Ashwagandha',
        location: 'Wayanad, Kerala',
        gps: '11.6854°N, 76.1320°E',
        quantity: '250kg',
        harvestDate: '2024-12-15'
      }
    },
    {
      id: 'step2',
      title: 'Quality Testing',
      description: 'Laboratory testing for purity, pesticides, and quality standards',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      details: {
        moisture: '10.5% ✓',
        pesticide: '0.15 ppm ✓',
        purity: '96.8% ✓',
        certification: 'NABL-QC-12345',
        lab: 'Quality Testing Lab, Mumbai'
      }
    },
    {
      id: 'step3',
      title: 'Processing',
      description: 'Manufacturing and processing with detailed condition tracking',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      details: {
        type: 'Solar Drying',
        temperature: '45°C',
        duration: '72 hours',
        output: '200kg dried herb',
        qualityGrade: 'Premium',
        location: 'Bengaluru Processing Unit'
      }
    },
    {
      id: 'step4',
      title: 'Medicine Creation',
      description: 'Final product with complete blockchain traceability',
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      details: {
        medicineId: 'MED-ASHWA-DEMO-001',
        name: 'Ashwagandha Capsules',
        manufacturing: '2024-12-20',
        expiry: '2026-12-20',
        batchUsed: 'BATCH-ASH-DEMO-001',
        qrCode: 'Generated ✓'
      }
    }
  ]

  const startDemo = async () => {
    setIsRunning(true)
    setDemoStep(0)
    setShowResults(false)
    setShowQRCode(false)

    for (let i = 0; i < demoSteps.length; i++) {
      setDemoStep(i)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Generate QR code
    const medicineId = demoSteps[3].details.medicineId
    setQrData(medicineId)
    setShowQRCode(true)
    setIsRunning(false)
  }

  const resetDemo = () => {
    setIsRunning(false)
    setDemoStep(0)
    setShowResults(false)
    setShowQRCode(false)
  }

  const simulateQRScan = () => {
    setShowResults(true)
  }

  const generateQRCode = async () => {
    if (qrData) {
      try {
        const canvas = document.getElementById('qrCanvas')
        if (canvas) {
          await QRCode.toCanvas(canvas, qrData, {
            width: 200,
            height: 200,
            color: {
              dark: '#2d5a27',
              light: '#ffffff'
            }
          })
        }
      } catch (error) {
        console.error('QR Code generation error:', error)
      }
    }
  }

  React.useEffect(() => {
    if (showQRCode && qrData) {
      generateQRCode()
    }
  }, [showQRCode, qrData])

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-6">
            End-to-End Traceability
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience the complete journey of herbs from farm to consumer with full blockchain transparency
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startDemo}
              disabled={isRunning}
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <Play className="w-5 h-5" />
              <span>{isRunning ? 'Running Demo...' : 'Start Demo'}</span>
            </button>
            
            <button
              onClick={resetDemo}
              className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset Demo</span>
            </button>
            
            <button
              onClick={() => setShowQRCode(true)}
              className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <QrCode className="w-5 h-5" />
              <span>Generate Sample QR</span>
            </button>
          </div>
        </motion.div>

        {/* Demo Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {demoSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = demoStep === index
            const isCompleted = demoStep > index
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative group ${
                  isActive ? 'scale-105' : ''
                } transition-all duration-300`}
              >
                <div className={`card hover:shadow-strong transition-all duration-300 ${
                  isActive ? 'ring-2 ring-primary-500 shadow-strong' : ''
                } ${isCompleted ? 'bg-primary-50' : ''}`}>
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                    isActive ? 'scale-110' : ''
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    {step.description}
                  </p>
                  
                  {/* Details */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-primary-50 rounded-lg p-4 mt-4"
                      >
                        <h4 className="font-semibold text-primary-800 mb-2">Sample Data:</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(step.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-primary-700 font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-primary-600">{value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Arrow */}
                {index < demoSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-primary-300" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* QR Code Display */}
        <AnimatePresence>
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card text-center mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generated QR Code</h2>
              <div className="flex flex-col items-center space-y-4">
                <canvas id="qrCanvas" className="border-2 border-primary-500 rounded-lg" />
                <p className="text-gray-600">Scan this QR code to view complete traceability information</p>
                <button
                  onClick={simulateQRScan}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Simulate QR Scan</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Traceability Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-8"
            >
              {/* Complete Traceability Information */}
              <div className="card">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Complete Traceability Information</h2>
                <div className="space-y-6">
                  {[
                    {
                      phase: 'Collection Phase',
                      icon: Leaf,
                      color: 'green',
                      data: {
                        date: '2024-12-15',
                        location: 'Wayanad, Kerala (11.6854°N, 76.1320°E)',
                        farmer: 'Rajesh Patel',
                        environmental: 'Temperature 28°C, Humidity 75%, Red laterite soil'
                      }
                    },
                    {
                      phase: 'Quality Testing Phase',
                      icon: Shield,
                      color: 'blue',
                      data: {
                        date: '2024-12-18',
                        laboratory: 'Quality Testing Lab, Mumbai',
                        tests: 'Moisture (10.5%), Pesticide (0.15 ppm), Purity (96.8%)',
                        certification: 'NABL-QC-12345'
                      }
                    },
                    {
                      phase: 'Processing Phase',
                      icon: Zap,
                      color: 'orange',
                      data: {
                        date: '2024-12-20',
                        location: 'Bengaluru Processing Unit',
                        method: 'Solar Drying (45°C, 72 hours)',
                        output: '200kg dried herb (Premium grade)'
                      }
                    },
                    {
                      phase: 'Medicine Creation',
                      icon: Package,
                      color: 'purple',
                      data: {
                        date: '2024-12-25',
                        manufacturer: 'Himalaya Herbal',
                        product: 'Ashwagandha Capsules',
                        expiry: '2026-12-25'
                      }
                    }
                  ].map((phase, index) => {
                    const Icon = phase.icon
                    return (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`w-12 h-12 bg-${phase.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 text-${phase.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{phase.phase}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            {Object.entries(phase.data).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>{' '}
                                {value}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Blockchain Verification */}
              <div className="card">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Blockchain Verification</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: CheckCircle,
                      title: 'Data Integrity Verified',
                      description: 'All data points have been cryptographically verified and stored on the blockchain'
                    },
                    {
                      icon: Shield,
                      title: 'Immutable Record',
                      description: 'No data can be altered or tampered with once recorded on the blockchain'
                    },
                    {
                      icon: Eye,
                      title: 'Complete Transparency',
                      description: 'Every step of the supply chain is visible and auditable by all stakeholders'
                    }
                  ].map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="text-center p-6 bg-primary-50 rounded-lg">
                        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TraceabilityPage
