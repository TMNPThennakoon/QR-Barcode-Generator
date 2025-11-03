import jsPDF from 'jspdf'

export async function downloadAsPNG(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function downloadAsJPG(dataUrl: string, filename: string, quality: number = 0.92) {
  const img = new Image()
  img.src = dataUrl
  
  await new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        const jpgDataUrl = canvas.toDataURL('image/jpeg', quality)
        const link = document.createElement('a')
        link.download = filename
        link.href = jpgDataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      resolve(null)
    }
  })
}

export async function downloadAsSVG(svgDataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = svgDataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function downloadAsPDF(
  dataUrl: string,
  content: string,
  codeType: 'qr' | 'barcode',
  filename: string,
  pageSize: 'A4' | 'Letter' | 'A5' = 'A4'
) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: pageSize,
  })

  const img = new Image()
  img.src = dataUrl

  await new Promise((resolve) => {
    img.onload = () => {
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Calculate dimensions to fit on page
      const maxWidth = pdfWidth - 40
      const maxHeight = pdfHeight - 80

      let imgWidth = img.width * 0.264583 // Convert pixels to mm
      let imgHeight = img.height * 0.264583

      // Scale to fit
      if (imgWidth > maxWidth) {
        imgHeight = (imgHeight * maxWidth) / imgWidth
        imgWidth = maxWidth
      }
      if (imgHeight > maxHeight) {
        imgWidth = (imgWidth * maxHeight) / imgHeight
        imgHeight = maxHeight
      }

      // Center the image
      const x = (pdfWidth - imgWidth) / 2
      const y = 30

      // Add title
      pdf.setFontSize(18)
      pdf.text(
        `${codeType === 'qr' ? 'QR Code' : 'Barcode'} Generator`,
        pdfWidth / 2,
        20,
        { align: 'center' }
      )

      // Add the image
      pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight)

      // Add content text
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      const contentY = y + imgHeight + 15
      const contentLines = pdf.splitTextToSize(`Content: ${content}`, pdfWidth - 40)
      pdf.text(contentLines, pdfWidth / 2, contentY, { align: 'center' })

      // Add timestamp
      pdf.setFontSize(8)
      pdf.text(
        `Generated on: ${new Date().toLocaleString()}`,
        pdfWidth / 2,
        pdfHeight - 10,
        { align: 'center' }
      )

      pdf.save(filename)
      resolve(null)
    }
  })
}

export async function copyToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const blob = await fetch(dataUrl).then((r) => r.blob())
    const item = new ClipboardItem({ 'image/png': blob })
    await navigator.clipboard.write([item])
    return true
  } catch (error) {
    return false
  }
}
