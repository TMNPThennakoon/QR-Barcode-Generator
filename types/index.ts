export interface QRCodeOptions {
  width: number
  margin: number
  darkColor: string
  lightColor: string
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  logo?: string
  logoSize?: number
  logoMargin?: number
}

export interface BarcodeOptions {
  format: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF14'
  width: number
  height: number
  displayValue: boolean
  fontSize: number
  margin: number
  foregroundColor: string
  backgroundColor: string
}

export interface QRCodeType {
  type: 'url' | 'wifi' | 'vcard' | 'email' | 'sms' | 'geolocation' | 'event' | 'text'
  data: any
}

export interface WiFiQRData {
  ssid: string
  password: string
  security: 'WPA' | 'WEP' | 'nopass'
  hidden?: boolean
}

export interface vCardData {
  firstName: string
  lastName: string
  organization?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  note?: string
}

export interface EmailQRData {
  email: string
  subject?: string
  body?: string
}

export interface SMSQRData {
  phone: string
  message?: string
}

export interface GeolocationQRData {
  latitude: number
  longitude: number
}

export interface EventQRData {
  title: string
  startDate: string
  endDate?: string
  location?: string
  description?: string
}

export interface GeneratedCode {
  id: string
  type: 'qr' | 'barcode'
  qrType?: string
  data: string
  image: string
  timestamp: number
  options?: Partial<QRCodeOptions> | Partial<BarcodeOptions>
}

