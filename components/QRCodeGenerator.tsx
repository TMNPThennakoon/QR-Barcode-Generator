'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode,
  Scan,
  FileImage,
  FileText,
  Sparkles,
  Settings,
  History,
  Moon,
  Sun,
  Camera,
  Plus,
  Save,
  Copy,
  Image as ImageIcon,
  Code2,
  MessageCircle,
  Send,
} from 'lucide-react'
import {
  generateQRCode,
  generateQRCodeAsSVG,
  generateWiFiQR,
  generatevCardQR,
  generateEmailQR,
  generateSMSQR,
  generateGeolocationQR,
  generateEventQR,
} from '@/utils/qrcode'
import { generateBarcode } from '@/utils/barcode'
import {
  downloadAsPNG,
  downloadAsPDF,
  downloadAsJPG,
  downloadAsSVG,
  copyToClipboard,
} from '@/utils/download'
import { saveToHistory, getHistory, clearHistory, removeFromHistory } from '@/utils/history'
import { QRCodeOptions, BarcodeOptions, GeneratedCode } from '@/types'
import AdvancedOptions from './AdvancedOptions'
import QRTypeForm from './QRTypeForm'
import HistoryPanel from './HistoryPanel'
import QRScanner from './QRScanner'
import BatchGenerator from './BatchGenerator'
import CodeTemplates from './CodeTemplates'

type CodeType = 'qr' | 'barcode'
type QRSubType = 'url' | 'wifi' | 'vcard' | 'email' | 'sms' | 'geolocation' | 'event' | 'text'

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('')
  const [codeType, setCodeType] = useState<CodeType>('qr')
  const [qrSubType, setQrSubType] = useState<QRSubType>('url')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showBatch, setShowBatch] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false)

  // Options state
  const [qrOptions, setQrOptions] = useState<Partial<QRCodeOptions>>({
    width: 400,
    margin: 2,
    darkColor: '#000000',
    lightColor: '#FFFFFF',
    errorCorrectionLevel: 'H',
  })

  const [barcodeOptions, setBarcodeOptions] = useState<Partial<BarcodeOptions>>({
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 16,
    margin: 10,
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
  })

  // QR Type specific data
  const [qrTypeData, setQrTypeData] = useState<any>({})

  // History
  const [history, setHistory] = useState<GeneratedCode[]>([])

  useEffect(() => {
    setHistory(getHistory())
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const handleGenerate = async () => {
    setError(null)
    setIsGenerating(true)
    setGeneratedImage(null)

    try {
      let dataUrl: string
      let dataString: string

      if (codeType === 'qr') {
        // Generate data string based on QR sub type
        switch (qrSubType) {
          case 'wifi':
            dataString = generateWiFiQR(qrTypeData)
            break
          case 'vcard':
            dataString = generatevCardQR(qrTypeData)
            break
          case 'email':
            dataString = generateEmailQR(qrTypeData)
            break
          case 'sms':
            dataString = generateSMSQR(qrTypeData)
            break
          case 'geolocation':
            dataString = generateGeolocationQR(qrTypeData)
            break
          case 'event':
            dataString = generateEventQR(qrTypeData)
            break
          case 'text':
            dataString = url || ''
            break
          default:
            dataString = url || ''
        }

        if (!dataString.trim()) {
          throw new Error('Please enter valid data')
        }

        dataUrl = await generateQRCode(dataString, qrOptions)
      } else {
        if (!url.trim()) {
          throw new Error('Please enter a URL or text')
        }
        dataUrl = await generateBarcode(url, barcodeOptions)
        dataString = url
      }

      setGeneratedImage(dataUrl)

      // Save to history
      saveToHistory({
        type: codeType,
        qrType: codeType === 'qr' ? qrSubType : undefined,
        data: dataString,
        image: dataUrl,
        timestamp: Date.now(),
        options: codeType === 'qr' ? qrOptions : barcodeOptions,
      })

      // Refresh history
      setHistory(getHistory())

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (format: 'png' | 'jpg' | 'pdf' | 'svg') => {
    if (!generatedImage) return

    const filename = `${codeType}-code.${format}`
    const dataString = codeType === 'qr' && qrSubType !== 'text' ? JSON.stringify(qrTypeData) : url

    switch (format) {
      case 'png':
        await downloadAsPNG(generatedImage, filename)
        break
      case 'jpg':
        await downloadAsJPG(generatedImage, filename)
        break
      case 'svg':
        if (codeType === 'qr') {
          const svgData = await generateQRCodeAsSVG(url || JSON.stringify(qrTypeData), qrOptions)
          await downloadAsSVG(svgData, filename)
        } else {
          setError('SVG download is only available for QR codes')
        }
        break
      case 'pdf':
        await downloadAsPDF(generatedImage, dataString, codeType, filename)
        break
    }
  }

  const handleCopyToClipboard = async () => {
    if (!generatedImage) return
    const success = await copyToClipboard(generatedImage)
    if (success) {
      alert('Copied to clipboard!')
    } else {
      setError('Failed to copy to clipboard')
    }
  }

  const handleSendToWhatsApp = async () => {
    if (!generatedImage) {
      setError('Please generate a code first')
      return
    }

    try {
      setError(null)
      setIsSendingWhatsApp(true)

      // Get content information for message
      const contentInfo = codeType === 'qr' && qrSubType !== 'text' 
        ? JSON.stringify(qrTypeData).substring(0, 100)
        : url || 'Generated Code'

      const message = `Hi! 👋\n\nI've generated a ${codeType === 'qr' ? 'QR code' : 'Barcode'} for you.\n\nContent: ${contentInfo}`

      // Method 1: Try Web Share API with file (works on mobile)
      try {
        const response = await fetch(generatedImage)
        const blob = await response.blob()
        const file = new File([blob], `${codeType}-code.png`, { type: 'image/png' })

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          // Share image directly - user can select WhatsApp from share menu
          await navigator.share({
            title: `${codeType === 'qr' ? 'QR Code' : 'Barcode'} Generated`,
            text: message,
            files: [file],
          })
          
          setIsSendingWhatsApp(false)
          return
        }
      } catch (shareError: any) {
        if (shareError.name !== 'AbortError') {
          console.log('Share API failed, using download method')
        }
      }

      // Method 2: Download image and open WhatsApp Web (user selects contact)
      // Download the image first
      const link = document.createElement('a')
      link.download = `${codeType}-code-${Date.now()}.png`
      link.href = generatedImage
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Open WhatsApp Web (without specific number - user will select contact)
      // Using WhatsApp Web API without phone number
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`
      
      // Try to open WhatsApp Web in new tab
      window.open(whatsappUrl, '_blank')

      // Also try WhatsApp Desktop/App if available
      setTimeout(() => {
        // Try WhatsApp Desktop protocol
        const whatsappDesktopUrl = `whatsapp://send?text=${encodedMessage}`
        window.location.href = whatsappDesktopUrl
      }, 500)

      setIsSendingWhatsApp(false)

    } catch (err) {
      setError('Failed to open WhatsApp. Please try again.')
      setIsSendingWhatsApp(false)
      console.error('WhatsApp share error:', err)
    }
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const loadFromHistory = (code: GeneratedCode) => {
    setGeneratedImage(code.image)
    if (code.options) {
      if (code.type === 'qr') {
        setQrOptions(code.options as QRCodeOptions)
      } else {
        setBarcodeOptions(code.options as BarcodeOptions)
      }
    }
    setShowHistory(false)
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${darkMode ? 'bg-blue-500/20' : 'bg-blue-400/30'}`}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          {/* Main Heading with Animated Icons */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 100 }}
              className="text-center mb-6"
            >
              <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                {/* Left Animated QR Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  className="relative"
                >
                  <motion.div
                    className={`absolute inset-0 ${darkMode ? 'bg-blue-500/30' : 'bg-blue-500/20'} rounded-full blur-xl`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <QrCode className={`relative z-10 w-10 h-10 md:w-14 md:h-14 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </motion.div>

                {/* Main Heading Text - NOW VISIBLE */}
                <span
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold inline-block ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  style={{
                    backgroundImage: darkMode
                      ? 'linear-gradient(to right, #60a5fa, #a78bfa, #f472b6, #60a5fa)'
                      : 'linear-gradient(to right, #2563eb, #7c3aed, #ec4899, #2563eb)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundPosition: '0% 50%',
                    animation: 'gradient-shift 5s ease infinite',
                  }}
                >
                  QR & Barcode Generator
                </span>

                {/* Right Animated Barcode Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: 180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.2, rotate: -15 }}
                  className="relative"
                >
                  <motion.div
                    className={`absolute inset-0 ${darkMode ? 'bg-purple-500/30' : 'bg-purple-500/20'} rounded-full blur-xl`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5,
                    }}
                  />
                  <Scan className={`relative z-10 w-10 h-10 md:w-14 md:h-14 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </motion.div>
              </div>
              
              {/* Glow effect under heading */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 flex justify-center"
              >
                <div
                  className={`h-1 w-32 md:w-48 rounded-full ${
                    darkMode
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                  }`}
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'gradient-shift 3s ease infinite',
                    boxShadow: darkMode
                      ? '0 0 20px rgba(96, 165, 250, 0.5), 0 0 40px rgba(167, 139, 250, 0.3)'
                      : '0 0 20px rgba(37, 99, 235, 0.5), 0 0 40px rgba(124, 58, 237, 0.3)',
                  }}
                />
              </motion.div>
            </motion.h1>
            
            {/* Simple Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className={`text-base md:text-lg lg:text-xl mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              This platform tools are <span className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>100% FREE</span> and easy to use!
            </motion.p>
          </div>

          {/* Secondary Icons Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 mb-4"
          >
            {[FileImage, FileText, Sparkles, Settings].map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.3, y: -5 }}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm`}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Dark Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="flex justify-center mb-4"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`relative p-3 md:p-4 rounded-xl ${darkMode ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white'} shadow-lg hover:shadow-2xl transition-all overflow-hidden`}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <motion.div
                animate={{ rotate: darkMode ? [0, 360] : [360, 0] }}
                transition={{ duration: 0.5 }}
              >
                {darkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6 relative z-10" /> : <Moon className="w-5 h-5 md:w-6 md:h-6 relative z-10" />}
              </motion.div>
            </motion.button>
          </motion.div>
          
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className={`text-base md:text-lg lg:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}
          >
            Generate professional QR codes and barcodes with advanced customization
          </motion.p>
        </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(!showHistory)}
              className={`relative px-6 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 overflow-hidden ${
                showHistory
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : darkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              {showHistory && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <History className="w-6 h-6 relative z-10" />
              <span className="relative z-10">History</span>
            </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowScanner(!showScanner)}
            className={`relative px-6 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 overflow-hidden ${
              showScanner
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                : darkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            {showScanner && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <Camera className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Scanner</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBatch(!showBatch)}
            className={`relative px-6 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 overflow-hidden ${
              showBatch
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : darkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            {showBatch && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <Plus className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Batch</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTemplates(!showTemplates)}
            className={`relative px-6 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 overflow-hidden ${
              showTemplates
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                : darkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            {showTemplates && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <Save className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Templates</span>
          </motion.button>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Generator Panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -5 }}
              className={`relative rounded-2xl shadow-2xl p-8 mb-6 overflow-hidden ${
                darkMode ? 'bg-gray-800/90 glass' : 'bg-white/90 glass'
              }`}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              />
              
              <div className="relative z-10">
              {/* Code Type Selection */}
              <div className="mb-6">
                <label className={`block text-lg font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Select Code Type
                </label>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCodeType('qr')
                      setGeneratedImage(null)
                    }}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-bold text-lg transition-all ${
                      codeType === 'qr'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : darkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <QrCode className="w-7 h-7" />
                    QR Code
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCodeType('barcode')
                      setGeneratedImage(null)
                    }}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-bold text-lg transition-all ${
                      codeType === 'barcode'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                        : darkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Scan className="w-7 h-7" />
                    Barcode
                  </motion.button>
                </div>
              </div>

              {/* QR Type Selection (if QR Code) */}
              {codeType === 'qr' && (
                <QRTypeForm
                  qrSubType={qrSubType}
                  setQrSubType={setQrSubType}
                  qrTypeData={qrTypeData}
                  setQrTypeData={setQrTypeData}
                  url={url}
                  setUrl={setUrl}
                  darkMode={darkMode}
                />
              )}

              {/* URL/Text Input for Barcode or Text QR */}
              {(codeType === 'barcode' || (codeType === 'qr' && qrSubType === 'text')) && (
                <div className="mb-6">
                  <label className={`block text-lg font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Enter {codeType === 'barcode' ? 'Text' : 'URL or Text'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleGenerate()
                        }
                      }}
                      placeholder={codeType === 'barcode' ? 'Enter text for barcode' : 'https://example.com or any text'}
                      className={`w-full px-5 py-4 pr-14 border-2 rounded-xl focus:outline-none transition-all text-lg md:text-xl ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    <Sparkles className={`absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`w-full mb-4 px-5 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  showAdvanced
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-6 h-6" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>

              {/* Advanced Options */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AdvancedOptions
                      codeType={codeType}
                      qrOptions={qrOptions}
                      setQrOptions={setQrOptions}
                      barcodeOptions={barcodeOptions}
                      setBarcodeOptions={setBarcodeOptions}
                      darkMode={darkMode}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating}
                className="relative w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 overflow-hidden group"
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-500"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                />
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                />
                
                <span className="relative z-10 flex items-center gap-2">
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Generate {codeType === 'qr' ? 'QR' : 'Barcode'} Code
                    </>
                  )}
                </span>
              </motion.button>
              </div>
            </motion.div>

            {/* Generated Code Display */}
            <AnimatePresence mode="wait">
              {generatedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                  className={`relative rounded-2xl shadow-2xl p-8 overflow-hidden ${darkMode ? 'bg-gray-800/90 glass' : 'bg-white/90 glass'}`}
                >
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
                      backgroundSize: '300% 300%',
                      padding: '2px',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${darkMode ? '' : ''}`}
                  >
                    Your {codeType === 'qr' ? 'QR' : 'Barcode'} Code
                  </motion.h2>
                  
                  <div className="flex justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className={`relative p-4 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} backdrop-blur-sm border-2 border-transparent`}
                    >
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                      <img
                        src={generatedImage}
                        alt={`Generated ${codeType}`}
                        className={`relative z-10 ${codeType === 'qr' ? 'w-64 h-64' : 'h-32'} object-contain`}
                      />
                    </motion.div>
                  </div>

                  {/* Download Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload('png')}
                      className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                      />
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="relative z-10"
                      >
                        <FileImage className="w-4 h-4" />
                      </motion.div>
                      <span className="relative z-10">PNG</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload('jpg')}
                      className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.7 }}
                      />
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="relative z-10"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </motion.div>
                      <span className="relative z-10">JPG</span>
                    </motion.button>
                    
                    {codeType === 'qr' && (
                      <motion.button
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload('svg')}
                        className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.9 }}
                        />
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="relative z-10"
                        >
                          <Code2 className="w-4 h-4" />
                        </motion.div>
                        <span className="relative z-10">SVG</span>
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload('pdf')}
                      className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.1 }}
                      />
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="relative z-10"
                      >
                        <FileText className="w-4 h-4" />
                      </motion.div>
                      <span className="relative z-10">PDF</span>
                    </motion.button>
                  </motion.div>
                  
                  <div className="space-y-4">
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyToClipboard}
                      className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-500"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{
                          backgroundSize: '200% 200%',
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="relative z-10"
                      >
                        <Copy className="w-4 h-4" />
                      </motion.div>
                      <span className="relative z-10">Copy to Clipboard</span>
                    </motion.button>

                    {/* WhatsApp Share Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendToWhatsApp}
                      disabled={isSendingWhatsApp}
                      className={`relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 via-emerald-600 to-green-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all overflow-hidden ${
                        isSendingWhatsApp ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-500"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{
                          backgroundSize: '200% 200%',
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      {isSendingWhatsApp ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full relative z-10"
                          />
                          <span className="relative z-10">Opening WhatsApp...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">Send to WhatsApp</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AnimatePresence>
              {showHistory && (
                <HistoryPanel
                  history={history}
                  setHistory={setHistory}
                  onLoad={loadFromHistory}
                  darkMode={darkMode}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showScanner && (
                <QRScanner darkMode={darkMode} onClose={() => setShowScanner(false)} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showBatch && (
                <BatchGenerator
                  codeType={codeType}
                  qrOptions={qrOptions}
                  barcodeOptions={barcodeOptions}
                  darkMode={darkMode}
                  onClose={() => setShowBatch(false)}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showTemplates && (
                <CodeTemplates
                  qrOptions={qrOptions}
                  barcodeOptions={barcodeOptions}
                  setQrOptions={setQrOptions}
                  setBarcodeOptions={setBarcodeOptions}
                  darkMode={darkMode}
                  onClose={() => setShowTemplates(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={`mt-16 py-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center space-y-2">
              <motion.p
                className={`text-base md:text-lg lg:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <span className="font-semibold">Develop by</span>{' '}
                <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Nayana Pabasara
                </span>
              </motion.p>
              <motion.p
                className={`text-sm md:text-base lg:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <span className="font-medium">
                  Instrumentation and Automation Engineering Technology Student University of Colombo
                </span>
              </motion.p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
