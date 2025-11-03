'use client'

import { motion } from 'framer-motion'
import { GeneratedCode } from '@/types'
import { History, Trash2, Loader2, X } from 'lucide-react'
import { removeFromHistory, clearHistory } from '@/utils/history'

interface HistoryPanelProps {
  history: GeneratedCode[]
  setHistory: (history: GeneratedCode[]) => void
  onLoad: (code: GeneratedCode) => void
  darkMode: boolean
}

export default function HistoryPanel({ history, setHistory, onLoad, darkMode }: HistoryPanelProps) {
  const handleClear = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      clearHistory()
      setHistory([])
    }
  }

  const handleRemove = (id: string) => {
    removeFromHistory(id)
    setHistory(history.filter((item) => item.id !== id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`rounded-2xl shadow-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <History className="w-5 h-5" />
          History
        </h2>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
              darkMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No history yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((code) => (
            <motion.div
              key={code.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => onLoad(code)}
            >
              <div className="flex items-start gap-3">
                <img
                  src={code.image}
                  alt={code.type}
                  className="w-16 h-16 object-contain rounded bg-white p-1"
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {code.type === 'qr' ? 'QR Code' : 'Barcode'}
                    {code.qrType && (
                      <span className={`ml-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({code.qrType})
                      </span>
                    )}
                  </div>
                  <div className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {code.data.length > 30 ? code.data.substring(0, 30) + '...' : code.data}
                  </div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(code.timestamp).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(code.id)
                  }}
                  className={`p-2 rounded-lg transition-all hover:bg-red-500 hover:text-white ${
                    darkMode ? 'text-gray-400 hover:bg-red-600' : 'text-gray-500 hover:bg-red-500'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

