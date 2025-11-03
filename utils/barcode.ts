import JsBarcode from 'jsbarcode'
import { BarcodeOptions } from '@/types'

export function generateBarcode(
  data: string,
  options?: Partial<BarcodeOptions>
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const defaultOptions: BarcodeOptions = {
        format: 'CODE128',
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 16,
        margin: 10,
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
      }

      const finalOptions = { ...defaultOptions, ...options }
      const canvas = document.createElement('canvas')

      JsBarcode(canvas, data, {
        format: finalOptions.format,
        width: finalOptions.width,
        height: finalOptions.height,
        displayValue: finalOptions.displayValue,
        fontSize: finalOptions.fontSize,
        margin: finalOptions.margin,
        lineColor: finalOptions.foregroundColor,
        background: finalOptions.backgroundColor,
      })

      const dataUrl = canvas.toDataURL('image/png')
      resolve(dataUrl)
    } catch (error) {
      reject(new Error('Failed to generate barcode'))
    }
  })
}
