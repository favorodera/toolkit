<script lang="ts" setup>
definePageMeta({
  layout: 'tool',
  toolName: 'Color Picker',
})

useSeoMeta({ ...toolsSeo('Color Picker') })

const maxSizeMB = ref(200)
const maxSize = computed(() => maxSizeMB.value * 1024 * 1024)

const { files, errors, openFileDialog, removeFile, dropzoneRef, inputRef } = useFileUpload({
  accept: 'image/*',
  maxSize: maxSize.value,
})

const currentFile = computed(() => files.value?.[0])
const colorPickerRef = useTemplateRef('colorPickerRef')
const imageRef = useTemplateRef('imageRef')

const isExtracting = ref(false)
const extractedColors = ref<string[]>([])


function extractColorsFromImage() {
  if (!imageRef.value || !currentFile.value) return

  isExtracting.value = true

  const image = imageRef.value.imgEl
  const canvas = document.createElement('canvas')
  const canvasRenderingContext = canvas.getContext('2d', { willReadFrequently: true })

  if (!canvasRenderingContext) {
    isExtracting.value = false
    return
  }

  const maxDimension = 200
  const scale = Math.min(maxDimension / image.naturalWidth, maxDimension / image.naturalHeight)

  canvas.width = image.naturalWidth * scale
  canvas.height = image.naturalHeight * scale

  canvasRenderingContext.drawImage(image, 0, 0, canvas.width, canvas.height)

  const imageData = canvasRenderingContext.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data

  const sampleRate = 5
  const colorMap = new Map<string, number>()

  for (let index = 0; index < pixels.length; index += 4 * sampleRate) {

    const red = pixels[index]
    const green = pixels[index + 1]
    const blue = pixels[index + 2]
    const alpha = pixels[index + 3]

    if (!red || !green || !blue || !alpha) continue
      
    if (alpha < 128) continue

    const brightness = (red + green + blue) / 3
    if (brightness > 250) continue

    const quantize = 16

    const quantizeRed = Math
      .min(255, Math.max(0, Math.round(red / quantize) * quantize))
      .toString(16).padStart(2, '0')

    const quantizeGreen = Math
      .min(255, Math.max(0, Math.round(green / quantize) * quantize))
      .toString(16).padStart(2, '0')

    const quantizeBlue = Math
      .min(255, Math.max(0, Math.round(blue / quantize) * quantize))
      .toString(16).padStart(2, '0')

    const hex = `#${quantizeRed}${quantizeGreen}${quantizeBlue}`

    colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
  }

  const sortedColors = Array.from(colorMap.entries())
    .sort((colorA, colorB) => colorB[1] - colorA[1])
    .map(([color]) => color)

  extractedColors.value = sortedColors
  isExtracting.value = false

}

watch(currentFile, async (newFile) => {
  if (newFile) {
    await nextTick()
    if (imageRef.value) {
      imageRef.value.imgEl.onload = () => {
        extractColorsFromImage()
      }
    }
  } else {
    extractedColors.value = []
  }
})
</script>

<template>
  <section
    class="
      @container relative grid gap-8
      lg:grid-cols-2
    "
  >
    <AppToolsColorPicker ref="colorPickerRef">

      <div
        v-if="extractedColors.length > 0"
        class="col-span-full flex items-center gap-3"
      >

        <div
          class="
            scrollbar-hidden flex flex-1 snap-x snap-mandatory gap-2
            overflow-x-auto overflow-y-hidden scroll-smooth
          "
        >
          <button
            v-for="(color, index) in extractedColors"
            :key="index"
            :style="{ backgroundColor: color }"
            class="
              relative size-10 shrink-0 cursor-pointer rounded-md border
              border-border transition-transform
              hover:scale-110
              focus-visible:ring-2 focus-visible:ring-ring
            "
            :aria-label="`Select color ${color}`"
            @click="colorPickerRef?.hexToHsl(color)"
          />

        </div>

      </div>

      <div
        v-if="extractedColors.length > 0"
        class="col-span-full text-center text-xs text-muted-foreground"
      >
        {{ extractedColors.length }} colors found on image
      </div>

      <div
        v-if="isExtracting"
        class="
          col-span-full flex items-center justify-center gap-2 text-sm
          text-muted-foreground
        "
      >
        <UiSpinner class="size-4" />
        Extracting colors...
      </div>

    </AppToolsColorPicker>

    <div class="flex h-full min-h-96 flex-col gap-2">

      <div class="relative size-full">

        <button
          ref="dropzoneRef"
          class="
            relative flex size-full flex-col items-center justify-center
            overflow-hidden rounded-xl border border-dashed border-input p-4
            transition-colors
            hover:bg-accent/50
            has-disabled:pointer-events-none has-disabled:opacity-50
            has-[img]:border-none
            has-[input:focus]:border-ring has-[input:focus]:ring-[3px]
            has-[input:focus]:ring-ring/50
            data-[dragging=true]:bg-accent/50
          "
          tabindex="0"
          @click="openFileDialog"
        >
          <input
            id="color-picker-file"
            ref="inputRef"
            hidden
            aria-label="Upload image"
          >

          <div
            v-if="currentFile"
            class="absolute inset-0"
          >
            <NuxtImg
              ref="imageRef"
              :src="currentFile.preview"
              :alt="currentFile.file.name"
              class="size-full object-cover"
            />
          </div>

          <div
            v-else
            class="
              flex flex-col items-center justify-center px-4 py-3 text-center
            "
          >
            <div
              class="
                mb-2 flex size-11 shrink-0 items-center justify-center
                rounded-full border bg-background
              "
              aria-hidden="true"
            >
              <Icon
                name="lucide:image-up"
                class="size-4 opacity-60"
              />
            </div>

            <p class="mb-1.5 text-sm font-medium">
              Pick colors directly from your images
              <br>
              Drag and drop or click to select a file
            </p>

            <p class="text-xs text-muted-foreground">
              Max size: {{ maxSizeMB }}MB
            </p>

          </div>

        </button>

        <div
          v-if="currentFile"
          class="absolute top-3 right-3"
        >
          <button
            type="button"
            class="
              z-50 flex size-8 cursor-pointer items-center justify-center
              rounded-full bg-black/60 text-white transition-[color,box-shadow]
              outline-none
              hover:bg-black/80
              focus-visible:border-ring focus-visible:ring-[3px]
              focus-visible:ring-ring/50
            "
            aria-label="Remove image"
            @click="removeFile(currentFile.id)"
          >
            <Icon
              name="lucide:x"
              class="size-4"
              aria-hidden="true"
            />
          </button>
        </div>

      </div>

      <div
        v-if="errors.length > 0"
        class="flex items-center gap-1 text-xs text-destructive"
        role="alert"
      >
        <Icon
          name="lucide:circle-alert"
          class="size-3 shrink-0"
        />
        <span>{{ errors[0] }}</span>
      </div>

    </div>


  </section>

</template>
