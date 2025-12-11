import { z } from 'zod'

// QR Code BYTE capacity limits (most common for URLs, emails, UTF-8 text)
const QR_CODE_BYTE_LIMITS = {
  L: 2953, // Low error correction (~7% recovery)
  M: 2331, // Medium error correction (~15% recovery)
  Q: 1663, // Quartile error correction (~25% recovery)
  H: 1273, // High error correction (~30% recovery)
}

// Safe limits (75% of max to ensure reliability)
const SAFE_LIMITS = {
  L: Math.floor(QR_CODE_BYTE_LIMITS.L * 0.75), // ~2215
  M: Math.floor(QR_CODE_BYTE_LIMITS.M * 0.75), // ~1748
  Q: Math.floor(QR_CODE_BYTE_LIMITS.Q * 0.75), // ~1247
  H: Math.floor(QR_CODE_BYTE_LIMITS.H * 0.75), // ~955
}

// Dynamic validation schemas based on error correction level
function createUrlSchema(level: QRCodeSettings['errorCorrectionLevel']) {
  return z.url('Invalid URL format').max(SAFE_LIMITS[level], `URL too long for QR code with ${level} error correction`)
}

function createTextSchema(level: QRCodeSettings['errorCorrectionLevel']) {
  return z.string().min(1, 'Text cannot be empty').max(SAFE_LIMITS[level], `Text too long for QR code with ${level} error correction`)
}

const wifiSchema = z.object({
  ssid: z.string().min(1, 'SSID is required').max(32, 'SSID is too long (max 32 characters)'),
  password: z.string().max(63, 'Password is too long (max 63 characters)'),
  hidden: z.boolean(),
  auth: z.enum(['WPA', 'WEP', 'nopass', 'WPA2']),
})

const mailSchema = z.object({
  receiver: z.email('Invalid email address'),
  subject: z.string().max(200, 'Subject is too long (max 200 characters)'),
  body: z.string().max(500, 'Body is too long (max 500 characters)'),
})

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
  lastName: z.string().max(100, 'Last name is too long').optional(),
  title: z.string().max(100, 'Title is too long').optional(),
  email: z.email('Invalid email').optional().or(z.literal('')),
  phoneNumber: z.string().max(20, 'Phone number is too long').optional(),
  address: z.string().max(200, 'Address is too long').optional(),
  website: z.url('Invalid URL').optional().or(z.literal('')),
  organization: z.string().max(100, 'Organization is too long').optional(),
})

function downloadQRCode(fileType: 'svg' | 'png',canvasWidth:number[],dataType:QRCodeDataType,dataUrl?:string,) {
  if (!dataUrl) return

  const width = canvasWidth[0]

  if (!width) return

  const filename = `qrcode-${dataType}-${Date.now()}.${fileType}`

  switch (fileType) {
    case 'png': {
      const anchorElement = document.createElement('a')
      anchorElement.href = dataUrl
      anchorElement.download = filename
      document.body.appendChild(anchorElement)
      anchorElement.click()
      document.body.removeChild(anchorElement)
      break
    }
  
    case 'svg': {
      const image = new Image()

      image.onload = () => {
        const canvas = document.createElement('canvas')

        canvas.width = width
        canvas.height = width

        const context = canvas.getContext('2d')
        if (!context) return

        context.drawImage(image, 0, 0)

        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="${canvas.width}" height="${canvas.height}" xlink:href="${dataUrl}"/>
</svg>`

        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
        const objectUrl = URL.createObjectURL(blob)

        const anchorElement = document.createElement('a')
        anchorElement.href = objectUrl
        anchorElement.download = filename
        document.body.appendChild(anchorElement)
        anchorElement.click()
        document.body.removeChild(anchorElement)
        URL.revokeObjectURL(objectUrl)
      }

      image.src = dataUrl
      break
    }
  }
}

export default function () {
  return {
    QR_CODE_BYTE_LIMITS,
    SAFE_LIMITS,
    schemas: {
      wifiSchema,
      mailSchema,
      contactSchema,
      createUrlSchema,
      createTextSchema,
    },
    downloadQRCode,
  }
}

export type WifiSchema = z.output<typeof wifiSchema>
export type MailSchema = z.output<typeof mailSchema>
export type ContactSchema = z.output<typeof contactSchema>
