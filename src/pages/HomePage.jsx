import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  QrCode, 
  Shield, 
  Users, 
  BarChart3, 
  Leaf, 
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Search,
  User
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import brandLogo from '../assets/brand-logo.jpeg'
import BatchTraceability from '../components/BatchTraceability'
import RegistrationGuide from '../components/RegistrationGuide'

const HomePage = () => {
  const { user } = useAuth()
  const [showBatchTraceability, setShowBatchTraceability] = useState(false)
  const [showRegistrationGuide, setShowRegistrationGuide] = useState(false)

  const features = [
    {
      icon: QrCode,
      title: 'QR Code Scanning',
      description: 'Instant access to complete product provenance through QR code scanning',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Customized dashboards for farmers, manufacturers, laboratories, and regulators',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Advanced analytics and reporting tools for stakeholders and administrators',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable, transparent records ensuring data integrity and trust',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Herb Batches Tracked' },
    { number: '500+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '50+', label: 'Partner Labs' }
  ]

  const testimonials = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Quality Manager, Himalaya Herbal',
      content: 'Herb Abhilekh has revolutionized our quality control process. The transparency it provides is unmatched.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Farmer, Organic Farms Kerala',
      content: 'Finally, a system that gives us credit for our hard work and ensures our herbs reach consumers safely.',
      rating: 5
    },
    {
      name: 'Dr. Amit Patel',
      role: 'Lab Director, NABL Certified Lab',
      content: 'The integration with our testing protocols is seamless. It has improved our efficiency significantly.',
      rating: 5
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Brand Logo */}
            <img
              src={brandLogo}
              alt="Herb Abhilekh Logo"
              className="mx-auto mb-6 h-20 w-20 md:h-28 md:w-28 object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)] rounded-lg"
              loading="eager"
            />

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 font-serif tracking-wide">
              Welcome to{' '}
              <span className="text-lime-300">HERB</span>
              <span className="italic"> ABHILEKH</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 mb-10 max-w-2xl mx-auto tracking-wide uppercase">
              Pure Herbs, Proven Authenticity
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/traceability"
                className="group btn-primary text-lg px-8 py-4 shadow-strong hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <QrCode className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                Scan QR Code
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={() => setShowBatchTraceability(true)}
                className="group btn-secondary text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <Search className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                Search by Batch ID
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {!user && (
                <>
                  <Link
                    to="/register"
                    className="group btn-secondary text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button
                    onClick={() => setShowRegistrationGuide(true)}
                    className="group btn-secondary text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <User className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                    Registration Guide
                  </button>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>NABL Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>ISO 17025</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
              Transparency from Root to Remedy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Go beyond the label. Our blockchain technology creates an unchangeable, transparent record of each herb's journey. Simply scan a product's QR code to instantly access its complete history.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group card hover:shadow-strong transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Traceability Flow */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
              End-to-End Traceability
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the complete journey of herbs from farm to consumer with full blockchain transparency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Collection', description: 'Herbs collected with GPS coordinates and environmental data', icon: Leaf },
              { step: '02', title: 'Quality Testing', description: 'Laboratory testing for purity, pesticides, and quality standards', icon: Shield },
              { step: '03', title: 'Processing', description: 'Manufacturing with detailed condition tracking', icon: Zap },
              { step: '04', title: 'Medicine', description: 'Final product with complete blockchain traceability', icon: QrCode }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="relative text-center group"
                >
                  <div className="card hover:shadow-strong transition-all duration-300">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-primary-300" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our partners say about Herb Abhilekh's impact on their operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card hover:shadow-strong transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-xl text-primary-200 mb-8 max-w-3xl mx-auto">
              Join the revolution in Ayurvedic medicine traceability. Start your journey towards complete transparency today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group btn-primary text-lg px-8 py-4 bg-white text-primary-900 hover:bg-primary-50 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/traceability"
                className="group btn-secondary text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                View Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Batch Traceability Modal */}
      {showBatchTraceability && (
        <BatchTraceability onClose={() => setShowBatchTraceability(false)} />
      )}

      {/* Registration Guide Modal */}
      {showRegistrationGuide && (
        <RegistrationGuide onClose={() => setShowRegistrationGuide(false)} />
      )}
    </div>
  )
}

export default HomePage
