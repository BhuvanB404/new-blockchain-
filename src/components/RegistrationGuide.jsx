import React from 'react'
import { motion } from 'framer-motion'
import { X, User, Shield, FlaskConical, Leaf, Building2, CheckCircle } from 'lucide-react'

const RegistrationGuide = ({ onClose }) => {
  const roles = [
    {
      name: 'Manufacturer',
      icon: Building2,
      description: 'Process herbs into medicines',
      example: {
        userId: 'Manufacturer01',
        password: 'manufacturer123',
        name: 'Ayurveda Pharma Ltd',
        email: 'info@ayurvedapharma.com',
        phone: '+91-9876543211',
        licenseNumber: 'APL-2024-001',
        address: 'Industrial Area, Delhi'
      }
    },
    {
      name: 'Laboratory',
      icon: FlaskConical,
      description: 'Test herb quality and safety',
      example: {
        userId: 'Laboratory01',
        password: 'lab123',
        name: 'Quality Test Lab',
        email: 'info@qualitylab.com',
        phone: '+91-9876543212',
        certification: 'ISO-17025',
        address: 'Science Park, Mumbai'
      }
    }
  ]

  return (
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
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Registration Guide</h3>
              <p className="text-sm text-gray-600">How to register and test the system</p>
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
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Available Roles</h4>
            <p className="text-gray-600">
              Only Laboratory and Manufacturer roles can register. Farmers use a separate mobile app to upload herb details.
            </p>
          </div>

          {/* Role Examples */}
          <div className="space-y-6">
            {roles.map((role, index) => {
              const Icon = role.icon
              return (
                <motion.div
                  key={role.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">{role.name}</h5>
                      <p className="text-gray-600 mb-4">{role.description}</p>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-3">Example Registration Data:</h6>
                        <div className="space-y-2 text-sm">
                          {Object.entries(role.example).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize font-medium">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-gray-900 font-mono">
                                {typeof value === 'object' 
                                  ? `${value.latitude}, ${value.longitude}`
                                  : value
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Instructions */}
          <div className="mt-8 card bg-blue-50 border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              How to Register
            </h4>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-800 flex-shrink-0 mt-0.5">1</div>
                <p>Click the "Register" button on the homepage</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-800 flex-shrink-0 mt-0.5">2</div>
                <p>Select your role (Farmer, Manufacturer, or Laboratory)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-800 flex-shrink-0 mt-0.5">3</div>
                <p>Fill in the registration form with the example data above</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-800 flex-shrink-0 mt-0.5">4</div>
                <p>Submit the form and wait for confirmation</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-800 flex-shrink-0 mt-0.5">5</div>
                <p>Login with your credentials to access the dashboard</p>
              </div>
            </div>
          </div>

          {/* Testing Instructions */}
          <div className="mt-6 card bg-green-50 border-green-200">
            <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              How the System Works
            </h4>
            <div className="space-y-3 text-green-800">
              <p><strong>Public Access:</strong> Anyone can scan QR codes or enter batch IDs to view herb traceability without login.</p>
              <p><strong>Laboratory Workflow:</strong> Login → Scan QR/Enter Batch ID → View farmer details → Upload lab test results.</p>
              <p><strong>Manufacturer Workflow:</strong> Login → Scan QR/Enter Batch ID → View farmer + lab details → Upload processing details.</p>
              <p><strong>Batch ID Examples:</strong> Use "BATCH-ASH-001", "BATCH-NEEM-001" to test traceability.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RegistrationGuide
