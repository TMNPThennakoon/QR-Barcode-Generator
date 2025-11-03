export async function startQRScanner(
  onSuccess: (decodedText: string) => void,
  onError?: (errorMessage: string) => void
): Promise<any> {
  const { Html5Qrcode } = await import('html5-qrcode')
  const html5QrCode = new Html5Qrcode('qr-reader')
  
  try {
    await html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        onSuccess(decodedText)
      },
      (errorMessage) => {
        if (onError) onError(errorMessage)
      }
    )
    return html5QrCode
  } catch (err) {
    throw new Error('Failed to start QR scanner')
  }
}

export async function stopQRScanner(scanner: any): Promise<void> {
  try {
    await scanner.stop()
    scanner.clear()
  } catch (err) {
    console.error('Failed to stop scanner:', err)
  }
}

export async function scanQRFromImage(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const { Html5Qrcode } = await import('html5-qrcode')
    const html5QrCode = new Html5Qrcode('qr-reader-temp')
    
    html5QrCode
      .scanFile(file, true)
      .then((decodedText) => {
        html5QrCode.clear()
        resolve(decodedText)
      })
      .catch((err) => {
        html5QrCode.clear()
        reject(new Error('Failed to scan QR code from image'))
      })
  })
}

