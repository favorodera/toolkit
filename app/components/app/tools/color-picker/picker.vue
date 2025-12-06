<script lang="ts" setup>
const eyedropper = useEyeDropper()
  
const copiedKey = ref<string | number | null>(null)
  
const hue = ref(0)
const saturation = ref(100)
const lightness = ref(50)
  
const colorFormats = ref(['hex', 'hsl', 'rgb'] as const)
const colorFormatModel = ref<typeof colorFormats.value[number]>('hex')
  
const colorAreaRef = useTemplateRef('colorArea')
const hueSliderRef = useTemplateRef('hueSlider')
  
const currentRgbArray = computed(() => hslToRgb(hue.value, saturation.value, lightness.value))
  
const currentHex = computed(() => {
  const [red, green, blue] = currentRgbArray.value
  return rgbToHex(red, green, blue)
})
  
const currentRgb = computed(() => {
  const [red, green, blue] = currentRgbArray.value
  return `rgb(${red}, ${green}, ${blue})`
})
  
const currentHsl = computed(() => {
  return `hsl(${hue.value}, ${saturation.value}%, ${lightness.value}%)`
})
  
const colorAreaBg = computed(() => `hsl(${hue.value}, 100%, 50%)`)
  
const inputsValue = computed({
  get() {
    switch (colorFormatModel.value) {
      case 'rgb': return currentRgb.value
      case 'hsl': return currentHsl.value
      default: return currentHex.value
    }
  },
  set(newValue: string) {
    const trimmedValue = newValue.trim()
      
    if (colorFormatModel.value === 'hex') {

      if (/^#[0-9A-Fa-f]{6}$/.test(trimmedValue)) {
        hexToHsl(trimmedValue)
      }

    } else if (colorFormatModel.value === 'rgb') {

      const rgbMatch = trimmedValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)

      if (rgbMatch) {
        const red = parseInt(rgbMatch[1]!)
        const green = parseInt(rgbMatch[2]!)
        const blue = parseInt(rgbMatch[3]!)
        const hexValue = rgbToHex(red, green, blue)
        hexToHsl(hexValue)
      }

    } else if (colorFormatModel.value === 'hsl') {

      const hslMatch = trimmedValue.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)

      if (hslMatch) {
        hue.value = parseInt(hslMatch[1]!)
        saturation.value = parseInt(hslMatch[2]!)
        lightness.value = parseInt(hslMatch[3]!)
      }

    }

  },
  
})

const outputValues = computed(() => ({
  hex: { value: currentHex.value, label: currentHex.value },
  hsl: { value: `hsl(${hue.value}, ${saturation.value}, ${lightness.value})`, label: `${hue.value}, ${saturation.value}, ${lightness.value}` },
  rgb: { value: `rgb(${currentRgbArray.value[0]}, ${currentRgbArray.value[1]}, ${currentRgbArray.value[2]})`, label: `${currentRgbArray.value[0]}, ${currentRgbArray.value[1]}, ${currentRgbArray.value[2]}` },

  // TODO: Add XYZ, CMYK, HWB, LUV, and LAB
}))

function hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
  hue /= 360
  saturation /= 100
  lightness /= 100
  
  let red: number, green: number, blue: number
  
  if (saturation === 0) {
    red = green = blue = lightness
  } else {
    const hueToRgbHelper = (darkBound: number, lightBound: number, huePosition: number) => {
      if (huePosition < 0) huePosition += 1
      if (huePosition > 1) huePosition -= 1
      if (huePosition < 1 / 6) return darkBound + (lightBound - darkBound) * 6 * huePosition
      if (huePosition < 1 / 2) return lightBound
      if (huePosition < 2 / 3) return darkBound + (lightBound - darkBound) * (2 / 3 - huePosition) * 6
      return darkBound
    }
  
    const lightBound = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
    const darkBound = 2 * lightness - lightBound
  
    red = hueToRgbHelper(darkBound, lightBound, hue + 1 / 3)
    green = hueToRgbHelper(darkBound, lightBound, hue)
    blue = hueToRgbHelper(darkBound, lightBound, hue - 1 / 3)
  }
  
  return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)]
}
  
function rgbToHex(red: number, green: number, blue: number) {
  const toHex = (color: number) => {
    const hex = color.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}
  
function hexToHsl(hex: string) {
  let red = 0, green = 0, blue = 0
  
  if (hex.length === 7) {
    red = parseInt(hex.substring(1, 3), 16)
    green = parseInt(hex.substring(3, 5), 16)
    blue = parseInt(hex.substring(5, 7), 16)
  } else {
    return [0, 0, 0]
  }
  
  red /= 255
  green /= 255
  blue /= 255
  
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  let hueCalculation = 0
  let saturationCalculation = 0
  const lightnessCalculation = (max + min) / 2
  
  if (max !== min) {
    const delta = max - min
    saturationCalculation = lightnessCalculation > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  
    switch (max) {
      case red:
        hueCalculation = (green - blue) / delta + (green < blue ? 6 : 0)
        break
      case green:
        hueCalculation = (blue - red) / delta + 2
        break
      case blue:
        hueCalculation = (red - green) / delta + 4
        break
    }
    hueCalculation /= 6
  }
  
  hue.value = Math.round(hueCalculation * 360)
  saturation.value = Math.round(saturationCalculation * 100)
  lightness.value = Math.round(lightnessCalculation * 100)
}
  
function updateColor(event: MouseEvent | TouchEvent, elementRef: typeof colorAreaRef | typeof hueSliderRef, callback: (xPercent: number, yPercent: number) => void) {
  if (!elementRef.value) return
  
  const element = useElementBounding(elementRef)
  const xAxis = 'clientX' in event ? event.clientX : event.touches?.[0]?.clientX
  const yAxis = 'clientY' in event ? event.clientY : event.touches?.[0]?.clientY
  
  if (xAxis === undefined || yAxis === undefined) return
  
  const xPos = Math.min(Math.max(0, xAxis - element.left.value), element.width.value)
  const xPercent = (xPos / element.width.value) * 100
  
  const yPos = Math.min(Math.max(0, yAxis - element.top.value), element.height.value)
  const yPercent = (yPos / element.height.value) * 100
  
  callback(xPercent, yPercent)
}
  
function updateSaturationAndLightness(saturationPercent: number, yPercent: number) {
  saturation.value = Math.round(saturationPercent)
  lightness.value = Math.round(100 - yPercent)
}
  
function handleColorAreaDrag(event: MouseEvent | TouchEvent) {
  event.preventDefault()
  
  function handleMove(moveEvent: MouseEvent | TouchEvent) {
    updateColor(moveEvent, colorAreaRef, updateSaturationAndLightness)
  }
  
  function handleEnd() {
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }
  
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove)
  document.addEventListener('touchend', handleEnd)
  
  handleMove(event)
}
  
function updateHue(huePercent: number) {
  hue.value = Math.round((huePercent / 100) * 360) % 360
}
  
function handleHueSliderDrag(event: MouseEvent | TouchEvent) {
  event.preventDefault()
  
  function handleMove(moveEvent: MouseEvent | TouchEvent) {
    updateColor(moveEvent, hueSliderRef, xPercent => updateHue(xPercent))
  }
  
  function handleEnd() {
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }
  
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove)
  document.addEventListener('touchend', handleEnd)
  
  handleMove(event)
}

const copy = async (key: string | number, text: string) => {
  const { copy } = useClipboard({ legacy: true })

  await copy(text)

  copiedKey.value = key

  toast.success(`${text} copied to clipboard`, {
    duration: 2000,
    onAutoClose: () => {
      copiedKey.value = null
    },
  })
}
  
watch(eyedropper.sRGBHex, (hexValue) => {
  if (hexValue.trim()) hexToHsl(hexValue)
})
</script>
  
<template>
  <UiCard>

    <UiCardContent class="p-6">

      <div
        class="
          grid grid-cols-1 gap-6
          md:grid-cols-2
        "
      >
        <!-- Left Column: Color Picker -->
        <div class="flex flex-col gap-4">
          <div
            ref="colorArea"
            tabindex="0"
            class="
              relative h-48 w-full overflow-hidden rounded-md border
              border-border
            "
            role="slider"
            :style="{ backgroundColor: colorAreaBg }"
            aria-label="Saturation and Lightness Selector"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="lightness"
            aria-valuetext="Saturation and Lightness"
            @mousedown.prevent="handleColorAreaDrag"
            @touchstart.prevent="handleColorAreaDrag"
          >
            <div class="absolute inset-0 bg-linear-[to_right,white,transparent]" />

            <div
              class="
                absolute inset-0 cursor-crosshair
                bg-linear-[to_top,black,transparent]
              "
            />

            <div
              class="
                pointer-events-none absolute size-4
                transform-[translate(-50%,-50%)] rounded-full border-2
                border-accent shadow-[0_0_1px_black,0_0_4px_rgba(0,0,0,0.4)]
              "
              :style="{ left: `${saturation}%`, top: `${100 - lightness}%`, backgroundColor: currentHsl }"
            />
          </div>
      
          <div
            ref="hueSlider"
            tabindex="0"
            class="
              relative z-0 h-4 w-full cursor-pointer rounded-sm border
              border-border
              bg-linear-[to_right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%)]
            "
            role="slider"
            aria-label="Hue Selector"
            aria-valuemin="0"
            aria-valuemax="360"
            :aria-valuenow="hue"
            @mousedown.prevent="handleHueSliderDrag"
            @touchstart.prevent="handleHueSliderDrag"
          >
            <div
              class="
                absolute top-1/2 z-1 h-full w-2
                transform-[translateY(-50%)_translateX(-50%)] cursor-grab
                rounded-full border border-accent
                shadow-[0_0_0_1px_black,0_0_4px_rgba(0,0,0,0.4)]
              "
              :style="{ left: `${hue / 3.6}%` }"
            />
          </div>

          <div class="flex items-center gap-2">
            <UiInput
              v-model="inputsValue"
              class="flex-1"
            />
            <UiSelect v-model="colorFormatModel">
              <UiSelectTrigger
                size="sm"
                class="w-24 cursor-pointer"
                aria-label="Color format selector"
              >
                <UiSelectValue />
              </UiSelectTrigger>

              <UiSelectContent>

                <UiSelectItem
                  v-for="format, index in colorFormats"
                  :key="index"
                  :value="format"
                  class="cursor-pointer uppercase"
                >
                  {{ format.toLocaleUpperCase() }}
                </UiSelectItem>

              </UiSelectContent>

            </UiSelect>
            
          </div>

          <UiButton
            variant="outline"
            class="w-full"
            :disabled="!eyedropper.isSupported"
            @click="eyedropper.open"
          >
            <Icon name="lucide:pipette" />
            Pick from screen
          </UiButton>

            
        </div>

        <!-- Right Column: Color Preview & Info -->
        <div class="flex flex-col gap-4">

          <div
            :style="{ backgroundColor: currentHsl }"
            tabindex="0"
            aria-label="Current selected color preview"
            class="h-32 w-full rounded-md border border-border transition-all"
          />

          <div class="grid grid-cols-2 gap-3">

            <button
              v-for="output, key in outputValues"
              :key
              class="
                cursor-copy rounded-md border border-border p-3 text-start
                transition-all
                hover:bg-accent
              "
              :aria-label="output.label"
              variant="outline"
              @click="copy(key, output.value)"
            >
              <p
                class="mb-1 text-xs text-muted-foreground uppercase"
              >
                {{ key }}
              </p>

              <p
                class="font-mono text-sm"
              >
                {{ output.label }}
              </p>

            </button>

            <div
              class="
                grid place-items-center rounded-md border border-border p-3
              "
              tabindex="0"
            >
              <div
                tabindex="0"
                class="text-center font-mono text-sm text-muted-foreground"
              >
                MORE COMING...
              </div>

            </div>

          </div>
          
        </div>

      </div>

    </UiCardContent>

  </UiCard>

</template>
