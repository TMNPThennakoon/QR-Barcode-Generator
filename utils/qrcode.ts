import QRCode from 'qrcode'
import { QRCodeOptions } from '@/types'

export async function generateQRCode(
  data: string,
  options?: Partial<QRCodeOptions>
): Promise<string> {
  try {
    const defaultOptions: QRCodeOptions = {
      width: 400,
      margin: 2,
      darkColor: '#000000',
      lightColor: '#FFFFFF',
      errorCorrectionLevel: 'H',
    }

    const finalOptions = { ...defaultOptions, ...options }

    const qrOptions: any = {
      width: finalOptions.width,
      margin: finalOptions.margin,
      color: {
        dark: finalOptions.darkColor,
        light: finalOptions.lightColor,
      },
      errorCorrectionLevel: finalOptions.errorCorrectionLevel,
    }

    let dataUrl = await QRCode.toDataURL(data, qrOptions)

    // Add logo if provided
    if (finalOptions.logo) {
      dataUrl = await addLogoToQR(dataUrl, finalOptions.logo, {
        logoSize: finalOptions.logoSize || 60,
        logoMargin: finalOptions.logoMargin || 2,
      })
    }

    return dataUrl
  } catch (error) {
    throw new Error('Failed to generate QR code')
  }
}

async function addLogoToQR(
  qrDataUrl: string,
  logoUrl: string,
  options: { logoSize: number; logoMargin: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const qrImg = new Image()
    qrImg.crossOrigin = 'anonymous'
    
    qrImg.onload = () => {
      const logoImg = new Image()
      logoImg.crossOrigin = 'anonymous'
      
      logoImg.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        canvas.width = qrImg.width
        canvas.height = qrImg.height

        // Draw QR code
        ctx.drawImage(qrImg, 0, 0)

        // Calculate logo position (center)
        const logoSize = options.logoSize
        const x = (canvas.width - logoSize) / 2
        const y = (canvas.height - logoSize) / 2

        // Draw white background for logo
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(
          x - options.logoMargin,
          y - options.logoMargin,
          logoSize + options.logoMargin * 2,
          logoSize + options.logoMargin * 2
        )

        // Draw logo
        ctx.drawImage(logoImg, x, y, logoSize, logoSize)

        resolve(canvas.toDataURL('image/png'))
      }

      logoImg.onerror = () => reject(new Error('Failed to load logo'))
      logoImg.src = logoUrl
    }

    qrImg.onerror = () => reject(new Error('Failed to load QR code'))
    qrImg.src = qrDataUrl
  })
}

export function generateWiFiQR(data: {
  ssid: string
  password: string
  security: 'WPA' | 'WEP' | 'nopass'
  hidden?: boolean
}): string {
  const hidden = data.hidden ? 'H:true' : 'H:false'
  return `WIFI:T:${data.security};S:${data.ssid};P:${data.password};${hidden};;`
}

export function generatevCardQR(data: {
  firstName: string
  lastName: string
  organization?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  note?: string
}): string {
  let vcard = 'BEGIN:VCARD\n'
  vcard += 'VERSION:3.0\n'
  vcard += `FN:${data.firstName} ${data.lastName}\n`
  vcard += `N:${data.lastName};${data.firstName};;;\n`
  if (data.organization) vcard += `ORG:${data.organization}\n`
  if (data.email) vcard += `EMAIL:${data.email}\n`
  if (data.phone) vcard += `TEL:${data.phone}\n`
  if (data.website) vcard += `URL:${data.website}\n`
  if (data.address) vcard += `ADR:;;${data.address};;;;\n`
  if (data.note) vcard += `NOTE:${data.note}\n`
  vcard += 'END:VCARD'
  return vcard
}

export function generateEmailQR(data: { email: string; subject?: string; body?: string }): string {
  let mailto = `mailto:${data.email}`
  const params: string[] = []
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`)
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`)
  if (params.length > 0) mailto += '?' + params.join('&')
  return mailto
}

export function generateSMSQR(data: { phone: string; message?: string }): string {
  let sms = `sms:${data.phone}`
  if (data.message) sms += `?body=${encodeURIComponent(data.message)}`
  return sms
}

export function generateGeolocationQR(data: { latitude: number; longitude: number }): string {
  return `geo:${data.latitude},${data.longitude}`
}

export function generateEventQR(data: {
  title: string
  startDate: string
  endDate?: string
  location?: string
  description?: string
}): string {
  let event = 'BEGIN:VEVENT\n'
  event += `SUMMARY:${data.title}\n`
  event += `DTSTART:${formatDateForICS(data.startDate)}\n`
  if (data.endDate) event += `DTEND:${formatDateForICS(data.endDate)}\n`
  if (data.location) event += `LOCATION:${data.location}\n`
  if (data.description) event += `DESCRIPTION:${data.description}\n`
  event += 'END:VEVENT'
  return event
}

function formatDateForICS(dateString: string): string {
  // Convert date to ICS format (YYYYMMDDTHHmmssZ)
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

export async function generateQRCodeAsSVG(
  data: string,
  options?: Partial<QRCodeOptions>
): Promise<string> {
  try {
    const defaultOptions: QRCodeOptions = {
      width: 400,
      margin: 2,
      darkColor: '#000000',
      lightColor: '#FFFFFF',
      errorCorrectionLevel: 'H',
    }

    const finalOptions = { ...defaultOptions, ...options }

    const qrOptions: any = {
      width: finalOptions.width,
      margin: finalOptions.margin,
      color: {
        dark: finalOptions.darkColor,
        light: finalOptions.lightColor,
      },
      errorCorrectionLevel: finalOptions.errorCorrectionLevel,
    }

    const svg = await QRCode.toString(data, { ...qrOptions, type: 'svg' })
    return `data:image/svg+xml;base64,${btoa(svg)}`
  } catch (error) {
    throw new Error('Failed to generate QR code as SVG')
  }
}
