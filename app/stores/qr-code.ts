import { useQRCode } from '@vueuse/integrations/useQRCode.js'
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
function createUrlSchema(level: keyof typeof SAFE_LIMITS) {
  return z.url('Invalid URL format').max(SAFE_LIMITS[level], `URL too long for QR code with ${level} error correction`)
}

function createTextSchema(level: keyof typeof SAFE_LIMITS) {
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
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phoneNumber: z.string().max(20, 'Phone number is too long').optional(),
  address: z.string().max(200, 'Address is too long').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  organization: z.string().max(100, 'Organization is too long').optional(),
})

export const useQRCodeStore = defineStore('qr-code-store', () => {

  const QRCodeDataType = ref<QRCodeDataType>('url')

  const QRCodeURLData = ref<string>('')
  const QRCodeTextData = ref<string>('')

  const QRCodeWifiData = reactive<z.output<typeof wifiSchema>>({
    ssid: '',
    password: '',
    hidden: false,
    auth: 'WPA',
  })

  const QRCodeMailData = reactive<z.output<typeof mailSchema>>({
    receiver: '',
    subject: '',
    body: '',
  })

  const QRCodeContactData = reactive<z.output<typeof contactSchema>>({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phoneNumber: '',
    address: '',
    website: '',
    organization: '',
  })

  const QRCodeSettings = reactive<QRCodeSettings>({
    errorCorrectionLevel: 'H',
    margin: [3],
    width: [256],
  })

  // Validation state
  const validationErrors = ref<string[]>([])
  const validationWarnings = ref<string[]>([])

  // Get current error correction level limits
  const getCurrentLimit = () => {
    const level = QRCodeSettings.errorCorrectionLevel
    return {
      max: QR_CODE_BYTE_LIMITS[level],
      safe: SAFE_LIMITS[level],
    }
  }

  // Validate current data
  const validateCurrentData = () => {
    validationErrors.value = []
    validationWarnings.value = []

    const level = QRCodeSettings.errorCorrectionLevel

    try {
      switch (QRCodeDataType.value) {
        case 'url': {
          const urlSchemaWithLevel = createUrlSchema(level)
          const result = urlSchemaWithLevel.safeParse(trim(QRCodeURLData.value))
          if (!result.success) {
            validationErrors.value = result.error.issues.map(error => error.message)
          }
          break
        }

        case 'text': {
          const textSchemaWithLevel = createTextSchema(level)
          const result = textSchemaWithLevel.safeParse(trim(QRCodeTextData.value))
          if (!result.success) {
            validationErrors.value = result.error.issues.map(error => error.message)
          }
          break
        }

        case 'wifi': {
          const result = wifiSchema.safeParse(QRCodeWifiData)
          if (!result.success) {
            validationErrors.value = result.error.issues.map(e => e.message)
          }
          break
        }

        case 'mail': {
          const result = mailSchema.safeParse(QRCodeMailData)
          if (!result.success) {
            validationErrors.value = result.error.issues.map(e => e.message)
          }
          break
        }

        case 'contact': {
          const result = contactSchema.safeParse(QRCodeContactData)
          if (!result.success) {
            validationErrors.value = result.error.issues.map(e => e.message)
          }
          break
        }

      }
    } catch {
      validationErrors.value = ['Validation failed']
    }
  }

  // Check data string length and add warnings
  const checkDataStringLength = (dataString: string) => {
    const length = dataString.length
    const { max, safe } = getCurrentLimit()
    const level = QRCodeSettings.errorCorrectionLevel
  
    // Critical: exceeds absolute maximum
    if (length > max) {
      validationWarnings.value.push(
        `Data exceeds maximum (${length}/${max} bytes). May be difficult to scan.`,
      )
      return
    }
  
    // Warning: exceeds safe limit
    if (length > safe) {
      validationWarnings.value.push(
        `Exceeds safe limit (${length}/${safe} bytes). May be difficult to scan.`,
      )
    }
  
    // Info: approaching limit
    if (length > safe * 0.7 && length <= safe) {
      validationWarnings.value.push(
        `Approaching capacity (${length}/${safe} bytes). Consider shortening.`,
      )
    }
  
    // Module density warning
    if (length > 800) {
      validationWarnings.value.push(
        `Dense QR code.`,
      )
    }
  
    // Error correction recommendations
    if (length > 600 && level === 'H') {
      validationWarnings.value.push(
        `Switch to level M for ${Math.floor((SAFE_LIMITS.M / SAFE_LIMITS.H - 1) * 100)}% more capacity.`,
      )
    }
  
    if (length < 200 && level === 'L') {
      validationWarnings.value.push(
        `Use level H for better damage resistance.`,
      )
    }
  }

  const QRCodeDataString = computed(() => {
    let dataString = ''

    switch (QRCodeDataType.value) {
      case 'url': {
        dataString = trim(QRCodeURLData.value) || ' '
        break
      }

      case 'text': {
        dataString = trim(QRCodeTextData.value) || ' '
        break
      }

      case 'wifi': {
        const { ssid, password, hidden, auth } = QRCodeWifiData
        
        if (!trim(ssid)) {
          dataString = ' '
        } else {
          const parts = [`T:${auth}`, `S:${ssid}`]
          
          if (auth !== 'nopass' && password) {
            parts.push(`P:${password}`)
          }
          
          if (hidden) {
            parts.push('H:true')
          }
          
          dataString = `WIFI:${parts.join(';')};;`
        }
        break
      }

      case 'mail': {
        const { receiver, subject, body } = QRCodeMailData
        if (!trim(receiver)) {
          dataString = ' '
        } else {
          const params = new URLSearchParams()

          if (subject) params.append('subject', subject)
          if (body) params.append('body', body)
          
          const queryString = params.toString()
          dataString = queryString ? `mailto:${receiver}?${queryString}` : `mailto:${receiver}`
        }
        break
      }

      case 'contact': {
        const { firstName, lastName, title, email, phoneNumber, address, website, organization } = QRCodeContactData
        
        if (!trim(firstName)) {
          dataString = ' '
        } else {
          const parts: string[] = []
          
          // Name fields (required)
          parts.push(`N:${lastName || ''};${firstName};;;`)
          
          // Full name
          const fullName = [firstName, lastName].filter(Boolean).join(' ')
          if (fullName) {
            parts.push(`FN:${fullName}`)
          }
          
          // Optional fields
          if (title) parts.push(`TITLE:${title}`)
          if (organization) parts.push(`ORG:${organization}`)
          if (email) parts.push(`EMAIL:${email}`)
          if (phoneNumber) parts.push(`TEL:${phoneNumber}`)
          if (address) parts.push(`ADR:;;${address};;;;`)
          if (website) parts.push(`URL:${website}`)
          
          dataString = `BEGIN:VCARD\nVERSION:3.0\n${parts.join('\n')}\nEND:VCARD`
        }
        break
      }

      default: {
        dataString = ' '
      }
    }

    // Validate and check length
    validateCurrentData()
    checkDataStringLength(dataString)

    return dataString
  })

  const QRCode = computed(() => useQRCode(QRCodeDataString, QRCodeSettings))

  // Computed for validation status
  const isValid = computed(() => validationErrors.value.length === 0)
  const hasWarnings = computed(() => validationWarnings.value.length > 0)
  const dataLength = computed(() => QRCodeDataString.value.length)
  const capacityPercentage = computed(() => {
    const { safe } = getCurrentLimit()
    return Math.min(Math.round((dataLength.value / safe) * 100), 100)
  })

  return {
    QRCodeURLData,
    QRCodeWifiData,
    QRCodeMailData,
    QRCodeTextData,
    QRCodeContactData,
    QRCodeDataString,
    QRCode,
    QRCodeDataType,
    QRCodeSettings,
    
    // Validation
    validationErrors,
    validationWarnings,
    isValid,
    hasWarnings,
    validateCurrentData,
    
    // Capacity info
    dataLength,
    capacityPercentage,
  }

})
