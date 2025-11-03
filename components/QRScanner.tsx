'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X, Check } from 'lucide-react'

interface QRScannerProps {
  darkMode: boolean
  onClose: () => void
}

export default function QRScanner({ darkMode, onClose }: QRScannerProps) {
  const [scanner, setScanner] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedText, setScannedText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const scannerRef = useRef<HTMLDivElement>(null)

  const startScanning = async () => {
    try {
      // Dynamically import and use html5-qrcode
      const { Html5Qrcode: Html5QrcodeClass } = await import('html5-qrcode')
      const html5QrCode = new Html5QrcodeClass('qr-reader')
      
      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setScannedText(decodedText)
          setIsScanning(false)
          stopScanning(html5QrCode)
        },
        (errorMessage) => {
          // Ignore errors
        }
      )

      setScanner(html5QrCode)
      setIsScanning(true)
      setError(null)
    } catch (err) {
      setError('Failed to start camera. Please check permissions.')
      setIsScanning(false)
    }
  }

  const stopScanning = async (scannerInstance?: any) => {
    const instance = scannerInstance || scanner
    if (instance) {
      try {
        await instance.stop()
        instance.clear()
        setIsScanning(false)
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Dynamically import and use html5-qrcode
      const { Html5Qrcode: Html5QrcodeClass } = await import('html5-qrcode')
      const html5QrCode = new Html5QrcodeClass('qr-reader-temp')
      const decodedText = await html5QrCode.scanFile(file, true)
      setScannedText(decodedText)
      html5QrCode.clear()
      setError(null)
    } catch (err) {
      setError('Failed to scan QR code from image')
    }
  }

  useEffect(() => {
    // Check if module is available (client-side only)
    import('html5-qrcode')
      .then(() => setIsReady(true))
      .catch(() => setError('Failed to load scanner library'))

    return () => {
      if (scanner) {
        stopScanning(scanner)
      }
    }
  }, [scanner])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`rounded-2xl shadow-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <Camera className="w-5 h-5" />
          QR Code Scanner
        </h2>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-all ${
            darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {!scannedText ? (
        <div className="space-y-4">
          <div
            id="qr-reader"
            ref={scannerRef}
            className={`w-full rounded-lg overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
            style={{ minHeight: '300px' }}
          />
          <div id="qr-reader-temp" style={{ display: 'none' }} />

          {error && (
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-600'}`}>
              {error}
            </div>
          )}

          <div className="flex gap-3">
            {!isScanning ? (
              <button
                onClick={startScanning}
                disabled={!isReady}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  !isReady
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Camera className="w-5 h-5" />
                {isReady ? 'Start Camera' : 'Loading...'}
              </button>
            ) : (
              <button
                onClick={() => stopScanning()}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  darkMode
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Stop Scanning
              </button>
            )}

            <label
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-5 h-5" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-50 text-green-700'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5" />
              <span className="font-semibold">QR Code Scanned Successfully!</span>
            </div>
            <div className={`mt-2 p-3 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white break-all`}>
              {scannedText}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(scannedText)
                alert('Copied to clipboard!')
              }}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Copy Text
            </button>
            <button
              onClick={() => {
                setScannedText(null)
                setError(null)
              }}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Scan Again
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

