'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Download, X } from 'lucide-react'
import { generateQRCode, generateQRCodeAsSVG } from '@/utils/qrcode'
import { generateBarcode } from '@/utils/barcode'
import { downloadAsPNG, downloadAsPDF } from '@/utils/download'
import { QRCodeOptions, BarcodeOptions } from '@/types'

interface BatchGeneratorProps {
  codeType: 'qr' | 'barcode'
  qrOptions: Partial<QRCodeOptions>
  barcodeOptions: Partial<BarcodeOptions>
  darkMode: boolean
  onClose: () => void
}

interface BatchItem {
  id: string
  text: string
  image?: string
}

export default function BatchGenerator({
  codeType,
  qrOptions,
  barcodeOptions,
  darkMode,
  onClose,
}: BatchGeneratorProps) {
  const [items, setItems] = useState<BatchItem[]>([{ id: '1', text: '' }])
  const [isGenerating, setIsGenerating] = useState(false)

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), text: '' }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, text: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  const generateAll = async () => {
    setIsGenerating(true)
    try {
      for (const item of items) {
        if (item.text.trim()) {
          try {
            const image =
              codeType === 'qr'
                ? await generateQRCode(item.text, qrOptions)
                : await generateBarcode(item.text, barcodeOptions)
            setItems((prev) =>
              prev.map((i) => (i.id === item.id ? { ...i, image } : i))
            )
          } catch (err) {
            console.error(`Failed to generate code for: ${item.text}`)
          }
        }
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadAll = async (format: 'png' | 'pdf') => {
    const generatedItems = items.filter((item) => item.image)
    for (const item of generatedItems) {
      if (item.image) {
        const filename = `batch-${item.id}-${item.text.substring(0, 10)}.${format}`
        if (format === 'png') {
          await downloadAsPNG(item.image, filename)
        } else {
          await downloadAsPDF(item.image, item.text, codeType, filename)
        }
        // Small delay to avoid browser blocking multiple downloads
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`rounded-2xl shadow-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <Plus className="w-5 h-5" />
          Batch Generator
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

      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(item.id, e.target.value)}
                placeholder={`Enter ${codeType === 'qr' ? 'URL or text' : 'text'} for ${codeType}`}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                  darkMode
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300'
                }`}
              />
              <button
                onClick={() => removeItem(item.id)}
                className={`p-2 rounded-lg transition-all ${
                  darkMode ? 'text-gray-400 hover:bg-red-600 hover:text-white' : 'text-gray-500 hover:bg-red-100'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {item.image && (
              <div className="mt-2 flex justify-center">
                <img
                  src={item.image}
                  alt={`Generated ${codeType}`}
                  className={`${codeType === 'qr' ? 'w-32 h-32' : 'h-16'} object-contain bg-white p-2 rounded`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={addItem}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            darkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
        <button
          onClick={generateAll}
          disabled={isGenerating}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            darkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700'
              : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate All'}
        </button>
      </div>

      {items.some((item) => item.image) && (
        <div className="flex gap-2">
          <button
            onClick={() => downloadAll('png')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Download className="w-4 h-4" />
            Download All PNG
          </button>
          <button
            onClick={() => downloadAll('pdf')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            <Download className="w-4 h-4" />
            Download All PDF
          </button>
        </div>
      )}
    </motion.div>
  )
}

