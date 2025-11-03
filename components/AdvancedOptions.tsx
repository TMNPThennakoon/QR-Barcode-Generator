'use client'

import { QRCodeOptions, BarcodeOptions } from '@/types'
import { Palette, Maximize2, Layers, AlertCircle, Settings } from 'lucide-react'

interface AdvancedOptionsProps {
  codeType: 'qr' | 'barcode'
  qrOptions: Partial<QRCodeOptions>
  setQrOptions: (options: Partial<QRCodeOptions>) => void
  barcodeOptions: Partial<BarcodeOptions>
  setBarcodeOptions: (options: Partial<BarcodeOptions>) => void
  darkMode: boolean
}

export default function AdvancedOptions({
  codeType,
  qrOptions,
  setQrOptions,
  barcodeOptions,
  setBarcodeOptions,
  darkMode,
}: AdvancedOptionsProps) {
  if (codeType === 'qr') {
    return (
      <div className={`rounded-xl p-4 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <Settings className="w-5 h-5" />
          QR Code Options
        </h3>

        <div className="space-y-4">
          {/* Size */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Size: {qrOptions.width || 400}px
            </label>
            <input
              type="range"
              min="200"
              max="1000"
              step="50"
              value={qrOptions.width || 400}
              onChange={(e) => setQrOptions({ ...qrOptions, width: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Margin */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Margin: {qrOptions.margin || 2}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={qrOptions.margin || 2}
              onChange={(e) => setQrOptions({ ...qrOptions, margin: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Dark Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={qrOptions.darkColor || '#000000'}
                  onChange={(e) => setQrOptions({ ...qrOptions, darkColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={qrOptions.darkColor || '#000000'}
                  onChange={(e) => setQrOptions({ ...qrOptions, darkColor: e.target.value })}
                  className={`flex-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'} border`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Light Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={qrOptions.lightColor || '#FFFFFF'}
                  onChange={(e) => setQrOptions({ ...qrOptions, lightColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={qrOptions.lightColor || '#FFFFFF'}
                  onChange={(e) => setQrOptions({ ...qrOptions, lightColor: e.target.value })}
                  className={`flex-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'} border`}
                />
              </div>
            </div>
          </div>

          {/* Error Correction Level */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Error Correction Level
            </label>
            <select
              value={qrOptions.errorCorrectionLevel || 'H'}
              onChange={(e) =>
                setQrOptions({
                  ...qrOptions,
                  errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H',
                })
              }
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'}`}
            >
              <option value="L">L - Low (~7%)</option>
              <option value="M">M - Medium (~15%)</option>
              <option value="Q">Q - Quartile (~25%)</option>
              <option value="H">H - High (~30%)</option>
            </select>
          </div>

          {/* Logo */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Logo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    setQrOptions({
                      ...qrOptions,
                      logo: event.target?.result as string,
                    })
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'}`}
            />
            {qrOptions.logo && (
              <button
                onClick={() => setQrOptions({ ...qrOptions, logo: undefined })}
                className="mt-2 text-red-500 text-sm hover:underline"
              >
                Remove Logo
              </button>
            )}
          </div>

          {qrOptions.logo && (
            <>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Logo Size: {qrOptions.logoSize || 60}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="10"
                  value={qrOptions.logoSize || 60}
                  onChange={(e) => setQrOptions({ ...qrOptions, logoSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Logo Margin: {qrOptions.logoMargin || 2}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={qrOptions.logoMargin || 2}
                  onChange={(e) => setQrOptions({ ...qrOptions, logoMargin: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl p-4 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <Settings className="w-5 h-5" />
        Barcode Options
      </h3>

      <div className="space-y-4">
        {/* Format */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Format
          </label>
          <select
            value={barcodeOptions.format || 'CODE128'}
            onChange={(e) =>
              setBarcodeOptions({
                ...barcodeOptions,
                format: e.target.value as any,
              })
            }
            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'}`}
          >
            <option value="CODE128">CODE128</option>
            <option value="CODE39">CODE39</option>
            <option value="EAN13">EAN13</option>
            <option value="EAN8">EAN8</option>
            <option value="UPC">UPC</option>
            <option value="ITF14">ITF14</option>
          </select>
        </div>

        {/* Width */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Width: {barcodeOptions.width || 2}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={barcodeOptions.width || 2}
            onChange={(e) => setBarcodeOptions({ ...barcodeOptions, width: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Height */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Height: {barcodeOptions.height || 100}px
          </label>
          <input
            type="range"
            min="50"
            max="200"
            step="10"
            value={barcodeOptions.height || 100}
            onChange={(e) => setBarcodeOptions({ ...barcodeOptions, height: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Font Size: {barcodeOptions.fontSize || 16}px
          </label>
          <input
            type="range"
            min="10"
            max="30"
            step="2"
            value={barcodeOptions.fontSize || 16}
            onChange={(e) => setBarcodeOptions({ ...barcodeOptions, fontSize: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Foreground
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={barcodeOptions.foregroundColor || '#000000'}
                onChange={(e) => setBarcodeOptions({ ...barcodeOptions, foregroundColor: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={barcodeOptions.foregroundColor || '#000000'}
                onChange={(e) => setBarcodeOptions({ ...barcodeOptions, foregroundColor: e.target.value })}
                className={`flex-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'} border`}
              />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Background
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={barcodeOptions.backgroundColor || '#FFFFFF'}
                onChange={(e) => setBarcodeOptions({ ...barcodeOptions, backgroundColor: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={barcodeOptions.backgroundColor || '#FFFFFF'}
                onChange={(e) => setBarcodeOptions({ ...barcodeOptions, backgroundColor: e.target.value })}
                className={`flex-1 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'} border`}
              />
            </div>
          </div>
        </div>

        {/* Display Value */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={barcodeOptions.displayValue !== false}
            onChange={(e) => setBarcodeOptions({ ...barcodeOptions, displayValue: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <label className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Display Text Value</label>
        </div>

        {/* Margin */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Margin: {barcodeOptions.margin || 10}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={barcodeOptions.margin || 10}
            onChange={(e) => setBarcodeOptions({ ...barcodeOptions, margin: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

