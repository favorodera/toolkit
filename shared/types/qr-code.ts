export type QRCodeDataType = 'url' | 'text' | 'wifi' | 'contact' | 'mail' | 'tel' | 'location'

export type QRCodeSettings = {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  margin: number[]
  width: number[]
}

