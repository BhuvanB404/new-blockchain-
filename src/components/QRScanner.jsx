import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, CameraOff, RotateCcw } from 'lucide-react'
import jsQR from 'jsqr'
import { useAuth } from '../contexts/AuthContext'
import { queryAPI } from '../services/api'
import toast from 'react-hot-toast'

const QRScanner = ({ onClose }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startScanning = async () => {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device')
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      
      setScanning(true)
      scanQRCode()
    } catch (error) {
      console.error('Camera error:', error)
      if (error.name === 'NotAllowedError') {
        toast.error('Camera access denied. Please allow camera access and try again.')
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found on this device.')
      } else {
        toast.error('Error accessing camera: ' + error.message)
      }
    }
  }

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setScanning(false)
  }

  const scanQRCode = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas) return

    const context = canvas.getContext('2d')
    
    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        
        if (code) {
          handleQRCodeScanned(code.data)
        } else if (scanning) {
          requestAnimationFrame(scan)
        }
      } else if (scanning) {
        requestAnimationFrame(scan)
      }
    }
    
    scan()
  }

  const handleQRCodeScanned = async (qrData) => {
    stopScanning()
    
    try {
      toast.loading('Scanning QR code...', { id: 'qr-scan' })
      
      // Try to get consumer info using the QR data as medicine ID
      try {
        const response = await queryAPI.getConsumerInfo({
          userId: user ? user.userId : 'Regulator01',
          medicineId: qrData
        })
        
        if (response.data.success) {
          setResult({ type: 'medicine', data: response.data.data })
          toast.success('QR code scanned successfully!', { id: 'qr-scan' })
          return
        }
      } catch (e) {
        // Continue to next search method
      }
      
      // Try as batch ID if medicine ID fails
      try {
        const response = await queryAPI.getBatchDetails({
          userId: user ? user.userId : 'Regulator01',
          batchId: qrData
        })
        
        if (response.data.success) {
          setResult({ type: 'batch', data: response.data.data })
          toast.success('QR code scanned successfully!', { id: 'qr-scan' })
          return
        }
      } catch (e) {
        // Continue to next search method
      }
      
      throw new Error('QR code not recognized in the system')
      
    } catch (error) {
      toast.error(`Error scanning QR code: ${error.message}`, { id: 'qr-scan' })
    }
  }

  const resetScanner = () => {
    setResult(null)
    stopScanning()
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
          className="bg-white rounded-2xl shadow-strong max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">QR Code Scanner</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!result ? (
              <div className="space-y-6">
                {/* Scanner */}
                <div className="relative">
                  <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-64 object-cover"
                      playsInline
                    />
                    {!scanning && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                        <div className="text-center text-white">
                          <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Camera Ready</p>
                          <p className="text-sm opacity-75">Click start to begin scanning</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Scanning overlay */}
                    {scanning && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-500 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-500 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-500 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-500 rounded-br-lg"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  {!scanning ? (
                    <button
                      onClick={startScanning}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Start Scanning</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopScanning}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <CameraOff className="w-5 h-5" />
                      <span>Stop Scanning</span>
                    </button>
                  )}
                </div>

                {/* Instructions */}
                <div className="text-center text-gray-600">
                  <p className="text-sm">
                    Position the QR code within the camera view to scan
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Result Header */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    QR Code Scanned Successfully!
                  </h3>
                  <p className="text-gray-600">
                    {result.type === 'medicine' ? 'Medicine Information' : 'Batch Information'}
                  </p>
                </div>

                {/* Result Data */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={resetScanner}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Scan Another</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QRScanner
