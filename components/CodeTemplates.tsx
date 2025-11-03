'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Trash2, X, Loader2 } from 'lucide-react'
import { QRCodeOptions, BarcodeOptions } from '@/types'

interface CodeTemplatesProps {
  qrOptions: Partial<QRCodeOptions>
  barcodeOptions: Partial<BarcodeOptions>
  setQrOptions: (options: Partial<QRCodeOptions>) => void
  setBarcodeOptions: (options: Partial<BarcodeOptions>) => void
  darkMode: boolean
  onClose: () => void
}

interface Template {
  id: string
  name: string
  type: 'qr' | 'barcode'
  options: Partial<QRCodeOptions> | Partial<BarcodeOptions>
  timestamp: number
}

const STORAGE_KEY = 'qr-code-templates'

export default function CodeTemplates({
  qrOptions,
  barcodeOptions,
  setQrOptions,
  setBarcodeOptions,
  darkMode,
  onClose,
}: CodeTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [templateName, setTemplateName] = useState('')
  const [selectedType, setSelectedType] = useState<'qr' | 'barcode'>('qr')

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        setTemplates(JSON.parse(data))
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const saveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name')
      return
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: templateName,
      type: selectedType,
      options: selectedType === 'qr' ? qrOptions : barcodeOptions,
      timestamp: Date.now(),
    }

    const updatedTemplates = [...templates, newTemplate]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates))
    setTemplates(updatedTemplates)
    setTemplateName('')
    alert('Template saved!')
  }

  const loadTemplate = (template: Template) => {
    if (template.type === 'qr') {
      setQrOptions(template.options as Partial<QRCodeOptions>)
    } else {
      setBarcodeOptions(template.options as Partial<BarcodeOptions>)
    }
    onClose()
    alert(`Template "${template.name}" loaded!`)
  }

  const deleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = templates.filter((t) => t.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates))
      setTemplates(updatedTemplates)
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
          <Save className="w-5 h-5" />
          Code Templates
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

      {/* Save Template */}
      <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Save Current Settings as Template
        </label>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setSelectedType('qr')}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedType === 'qr'
                ? 'bg-blue-600 text-white'
                : darkMode
                ? 'bg-gray-600 text-gray-200'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            QR Code
          </button>
          <button
            onClick={() => setSelectedType('barcode')}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedType === 'barcode'
                ? 'bg-purple-600 text-white'
                : darkMode
                ? 'bg-gray-600 text-gray-200'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Barcode
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name"
            className={`flex-1 px-3 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                : 'bg-white border-gray-300'
            }`}
          />
          <button
            onClick={saveTemplate}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              darkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {templates.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Save className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No templates saved</p>
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {template.name}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {template.type === 'qr' ? 'QR Code' : 'Barcode'} •{' '}
                  {new Date(template.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => loadTemplate(template)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    darkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Load
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className={`p-2 rounded-lg transition-all ${
                    darkMode
                      ? 'text-gray-400 hover:bg-red-600 hover:text-white'
                      : 'text-gray-500 hover:bg-red-100'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

