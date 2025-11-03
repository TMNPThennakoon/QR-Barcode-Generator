'use client'

import { useState } from 'react'
import { Wifi, User, Mail, MessageSquare, MapPin, Calendar, Link, Sparkles } from 'lucide-react'

type QRSubType = 'url' | 'wifi' | 'vcard' | 'email' | 'sms' | 'geolocation' | 'event' | 'text'

interface QRTypeFormProps {
  qrSubType: QRSubType | string
  setQrSubType: (type: QRSubType | string) => void
  qrTypeData: any
  setQrTypeData: (data: any) => void
  url: string
  setUrl: (url: string) => void
  darkMode: boolean
}

export default function QRTypeForm({
  qrSubType,
  setQrSubType,
  qrTypeData,
  setQrTypeData,
  url,
  setUrl,
  darkMode,
}: QRTypeFormProps) {
  const types = [
    { value: 'text', label: 'Text/URL', icon: Link },
    { value: 'wifi', label: 'WiFi', icon: Wifi },
    { value: 'vcard', label: 'vCard', icon: User },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
    { value: 'geolocation', label: 'Location', icon: MapPin },
    { value: 'event', label: 'Event', icon: Calendar },
  ]

  const renderForm = () => {
    switch (qrSubType) {
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={qrTypeData.ssid || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, ssid: e.target.value })}
                placeholder="MyWiFiNetwork"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={qrTypeData.password || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, password: e.target.value })}
                placeholder="Password123"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Security Type
              </label>
              <select
                value={qrTypeData.security || 'WPA'}
                onChange={(e) => setQrTypeData({ ...qrTypeData, security: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={qrTypeData.hidden || false}
                onChange={(e) => setQrTypeData({ ...qrTypeData, hidden: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <label className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Hidden Network</label>
            </div>
          </div>
        )

      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  First Name
                </label>
                <input
                  type="text"
                  value={qrTypeData.firstName || ''}
                  onChange={(e) => setQrTypeData({ ...qrTypeData, firstName: e.target.value })}
                  placeholder="John"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={qrTypeData.lastName || ''}
                  onChange={(e) => setQrTypeData({ ...qrTypeData, lastName: e.target.value })}
                  placeholder="Doe"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Organization
              </label>
              <input
                type="text"
                value={qrTypeData.organization || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, organization: e.target.value })}
                placeholder="Company Inc."
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={qrTypeData.email || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, email: e.target.value })}
                placeholder="john@example.com"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Phone
              </label>
              <input
                type="tel"
                value={qrTypeData.phone || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, phone: e.target.value })}
                placeholder="+1234567890"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Website
              </label>
              <input
                type="url"
                value={qrTypeData.website || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, website: e.target.value })}
                placeholder="https://example.com"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Address
              </label>
              <input
                type="text"
                value={qrTypeData.address || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, address: e.target.value })}
                placeholder="123 Main St, City, Country"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={qrTypeData.email || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, email: e.target.value })}
                placeholder="recipient@example.com"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Subject
              </label>
              <input
                type="text"
                value={qrTypeData.subject || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, subject: e.target.value })}
                placeholder="Email Subject"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Message
              </label>
              <textarea
                value={qrTypeData.body || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, body: e.target.value })}
                placeholder="Email body text"
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>
        )

      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Phone Number
              </label>
              <input
                type="tel"
                value={qrTypeData.phone || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, phone: e.target.value })}
                placeholder="+1234567890"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Message
              </label>
              <textarea
                value={qrTypeData.message || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, message: e.target.value })}
                placeholder="SMS message text"
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>
        )

      case 'geolocation':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={qrTypeData.latitude || ''}
                  onChange={(e) => setQrTypeData({ ...qrTypeData, latitude: parseFloat(e.target.value) })}
                  placeholder="40.7128"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={qrTypeData.longitude || ''}
                  onChange={(e) => setQrTypeData({ ...qrTypeData, longitude: parseFloat(e.target.value) })}
                  placeholder="-74.0060"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setQrTypeData({
                      ...qrTypeData,
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    })
                  })
                }
              }}
              className={`w-full px-4 py-2 rounded-lg font-semibold ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Use Current Location
            </button>
          </div>
        )

      case 'event':
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Event Title
              </label>
              <input
                type="text"
                value={qrTypeData.title || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, title: e.target.value })}
                placeholder="Meeting/Event Name"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={qrTypeData.startDate || ''}
                  onChange={(e) => setQrTypeData({ ...qrTypeData, startDate: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={qrTypeData.endDate || ''}
                  onChange={(e) => setQrTypeData({ ...qrTypeData, endDate: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Location
              </label>
              <input
                type="text"
                value={qrTypeData.location || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, location: e.target.value })}
                placeholder="Event Location"
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={qrTypeData.description || ''}
                onChange={(e) => setQrTypeData({ ...qrTypeData, description: e.target.value })}
                placeholder="Event description"
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>
        )

      default:
        return (
          <div>
            <label className={`block text-lg font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Enter URL or Text
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com or any text"
                className={`w-full px-5 py-4 pr-14 border-2 rounded-xl focus:outline-none transition-all text-lg md:text-xl ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              <Sparkles className={`absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="mb-6">
      <label className={`block text-lg font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        QR Code Type
      </label>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-4">
        {types.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.value}
              onClick={() => {
                setQrSubType(type.value)
                setQrTypeData({})
              }}
              className={`flex flex-col items-center gap-2 px-4 py-4 rounded-lg font-bold text-sm md:text-base transition-all ${
                qrSubType === type.value
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : darkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-6 h-6 md:w-7 md:h-7" />
              <span className="hidden md:inline">{type.label}</span>
            </button>
          )
        })}
      </div>
      {renderForm()}
    </div>
  )
}

