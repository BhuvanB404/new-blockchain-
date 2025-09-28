import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/auth': {
        target: 'http://192.168.1.33:5000',
        changeOrigin: true,
      },
      '/createHerbBatch': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/addQualityTest': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/addProcessingStep': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/transferBatch': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/createMedicine': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/onboardFarmer': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/onboardManufacturer': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/onboardLaboratory': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/getConsumerInfo': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/getBatchDetails': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/getMedicineDetails': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/getBatchesByFarmer': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/trackSupplyChain': { target: 'http://192.168.1.33:5000', changeOrigin: true },
      '/fetchLedger': { target: 'http://192.168.1.33:5000', changeOrigin: true },
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
