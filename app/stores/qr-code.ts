import { useQRCode } from '@vueuse/integrations/useQRCode.js'

const {
  schemas: {
    wifiSchema,
    mailSchema,
    contactSchema,
    createUrlSchema,
    createTextSchema,
    createTelSchema,
    locationSchema,
  },
  SAFE_LIMITS,
  QR_CODE_BYTE_LIMITS,
} = qrCodeHandler()

export const useQRCodeStore = defineStore('qr-code-store', () => {

  const QRCodeDataType = ref<QRCodeDataType>('url')

  const QRCodeURLData = ref<string>('')
  const QRCodeTextData = ref<string>('')
  const QRCodeTelData = ref<string>('')

  const QRCodeWifiData = reactive<WifiSchema>({
    ssid: '',
    password: '',
    hidden: false,
    auth: 'WPA',
  })

  const QRCodeMailData = reactive<MailSchema>({
    receiver: '',
    subject: '',
    body: '',
  })

  const QRCodeContactData = reactive<ContactSchema>({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phoneNumber: '',
    address: '',
    website: '',
    organization: '',
  })

  const QRCodeLocationData = reactive<LocationSchema>({
    latitude: 0.000000,
    longitude: 0.000000,
    altitude: 0.0,
  })

  const QRCodeSettings = reactive<QRCodeSettings>({
    errorCorrectionLevel: 'H',
    margin: [3],
    width: [300],
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
  function validateCurrentData() {
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

        case 'tel': {
          const telSchemaWithLevel = createTelSchema(level)
          const result = telSchemaWithLevel.safeParse(trim(QRCodeTelData.value))
          if (!result.success) {
            validationErrors.value = result.error.issues.map(error => error.message)
          }
          break
        }

        case 'wifi': {
          const result = wifiSchema.safeParse(QRCodeWifiData)
          if (!result.success) {
            validationErrors.value = result.error.issues.map(error => error.message)
          }
          break
        }

        case 'mail': {
          const result = mailSchema.safeParse(QRCodeMailData)
          if (!result.success) {
            validationErrors.value = result.error.issues.map(error => error.message)
          }
          break
        }

        case 'contact': {
          const result = contactSchema.safeParse(QRCodeContactData)
          if (!result.success) {
            validationErrors.value = result.error.issues.map(error => error.message)
          }
          break
        }

        case 'location': {
          const result = locationSchema.safeParse(QRCodeLocationData)
          if (!result.success) {
            validationErrors.value = result.error.issues.map(error => error.message)
          }
          break
        }

      }
    } catch {
      validationErrors.value = ['Validation failed']
    }
  }

  // Check data string length and add warnings
  function checkDataStringLength(dataString: string) {
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

      case 'tel': {
        const phoneNumber = trim(QRCodeTelData.value)
        dataString = phoneNumber ? `tel:${phoneNumber}` : ' '
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

      case 'location': {
        const { latitude, longitude, altitude } = QRCodeLocationData
        
        // Check if required fields are valid numbers
        if (
          typeof latitude !== 'number'
          || typeof longitude !== 'number'
          || isNaN(latitude)
          || isNaN(longitude)
        ) {
          dataString = ' '
        } else {
          // Format coordinates to 6 decimal places
          const lat = latitude.toFixed(6)
          const lng = longitude.toFixed(6)
          
          // geo:latitude,longitude,altitude format
          if (altitude !== undefined && !isNaN(altitude)) {
            const alt = altitude.toFixed(1)
            dataString = `geo:${lat},${lng},${alt}`
          } else {
            dataString = `geo:${lat},${lng}`
          }
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
    QRCodeTelData,
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
