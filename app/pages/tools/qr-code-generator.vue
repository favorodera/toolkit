<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { LazyAppToolsQrCodeGeneratorContact, LazyAppToolsQrCodeGeneratorEmail, LazyAppToolsQrCodeGeneratorText, LazyAppToolsQrCodeGeneratorUrl, LazyAppToolsQrCodeGeneratorWifi } from '#components'
  
definePageMeta({
  layout: 'tool',
  toolName: 'QR Code Generator',
})
  
useSeoMeta({
  title: () => toolsRegistry['qrCodeGenerator'].name,
  description: () => toolsRegistry['qrCodeGenerator'].description,
  ogTitle: () => toolsRegistry['qrCodeGenerator'].name,
  ogDescription: () => toolsRegistry['qrCodeGenerator'].description,
  twitterTitle: () => toolsRegistry['qrCodeGenerator'].name,
  twitterDescription: () => toolsRegistry['qrCodeGenerator'].description,
})

const qrCodeData = useState('qr-code-data', () => '')
  
const dataTypes = [
  { type: 'url', icon: 'lucide:link-2' },
  { type: 'text', icon: 'lucide:text' },
  { type: 'email', icon: 'lucide:mail' },
  { type: 'wifi', icon: 'lucide:wifi' },
  { type: 'contact', icon: 'lucide:contact' },
  { type: 'sms', icon: 'lucide:message-circle-plus' },
  { type: 'tel', icon: 'lucide:phone' },
  { type: 'calendar', icon: 'lucide:calendar' },
]

const dataType = ref<typeof dataTypes[number]['type']>('url')
  
const dataTypeComponents = [
  LazyAppToolsQrCodeGeneratorUrl,
  LazyAppToolsQrCodeGeneratorText,
  LazyAppToolsQrCodeGeneratorEmail,
  LazyAppToolsQrCodeGeneratorWifi,
  LazyAppToolsQrCodeGeneratorContact,
]

const errorCorrectionLevels = ref([
  { label: 'Low (≈7%)', value: 'L' },
  { label: 'Medium (≈15%)', value: 'M' },
  { label: 'Quartile (≈25%)', value: 'Q' },
  { label: 'High (≈30%)', value: 'H' },

])

const settings = ref({
  errorCorrectionLevel: 'H',
  margin: [3],
  width: [256],
})

const qrCode = computed(() => useQRCode(qrCodeData, { ...settings.value }))
  

function downloadQRCode(fileType: 'svg' | 'png') {
  if (!qrCode.value.value) return

  const dataUrl = qrCode.value.value
  const filename = `qrcode-${dataType.value}-${Date.now()}.${fileType}`

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
        canvas.width = settings.value.width[0]!
        canvas.height = settings.value.width[0]!

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
</script>
  
<template>
  
  <section
    class="relative"
  >
  
    <UiTabs
      v-model="dataType"
      class="h-[calc(100dvh-16rem)]"
    >

      <UiTabsList
        class="
          w-full
          **:cursor-pointer
        "
      >

        <div
          class="
            contents
            sm:hidden
          "
        >
          <UiTabsTrigger
            v-for="trigger in dataTypes.slice(0, 2)"
            :key="trigger.type"
            :value="trigger.type"
          >
            <Icon
              :name="trigger.icon"
            />
            {{ trigger.type.toUpperCase() }}
          </UiTabsTrigger>

          <AppToolsQrCodeGeneratorMobileTabList
            v-model="dataType"
            :data-types="dataTypes.slice(2)"
          />
        </div>

        <div
          class="
            hidden
            sm:contents
            md:hidden
          "
        >
          <UiTabsTrigger
            v-for="trigger in dataTypes.slice(0, 4)"
            :key="trigger.type"
            :value="trigger.type"
          >
            <Icon
              :name="trigger.icon"
            />
            {{ trigger.type.toUpperCase() }}
          </UiTabsTrigger>

          <AppToolsQrCodeGeneratorMobileTabList
            v-model="dataType"
            :data-types="dataTypes.slice(4)"
          />
        </div>

        <div
          class="
            hidden
            md:contents
            lg:hidden
          "
        >
          <UiTabsTrigger
            v-for="trigger in dataTypes.slice(0, 5)"
            :key="trigger.type"
            :value="trigger.type"
          >
            <Icon
              :name="trigger.icon"
            />
            {{ trigger.type.toUpperCase() }}
          </UiTabsTrigger>

          <AppToolsQrCodeGeneratorMobileTabList
            v-model="dataType"
            :data-types="dataTypes.slice(5)"
          />
        </div>

        <div
          class="
            hidden
            lg:contents
          "
        >
          <UiTabsTrigger
            v-for="trigger in dataTypes"
            :key="trigger.type"
            :value="trigger.type"
          >
            <Icon
              :name="trigger.icon"
            />
            {{ trigger.type.toUpperCase() }}
          </UiTabsTrigger>
        </div>

      </UiTabsList>
  
      <UiTabsContent
        v-for="content, index in dataTypes"
        :key="index"
        :value="content.type"
        class="
          relative scrollbar-hidden flex max-h-[calc(100dvh-14rem)] flex-1
          flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-md border
          border-border p-4
        "
      >

        <KeepAlive>
          <component :is="dataTypeComponents[index]" />
        </KeepAlive>
       
      </UiTabsContent>
  
    </UiTabs>
    
    <UiDialog>

      <UiDialogTrigger
        as-child
        class="absolute right-8 bottom-8 z-1"
      >
        <UiButton
          variant="secondary"
          size="icon-lg"
        >
          <Icon name="lucide:qr-code" />
          <span class="sr-only">Preview QR Code</span>
        </UiButton>
      </UiDialogTrigger>

      <UiDialogContent>


        <UiDialogHeader>
          <UiDialogTitle>Preview QR Code</UiDialogTitle>
          <UiDialogDescription>Preview and customize generated QR Code</UiDialogDescription>
        </UiDialogHeader>

        <div
          class="
            grid aspect-square w-full place-items-center rounded-md border
            border-border p-4
          "
        >

          <NuxtImg
            :src="qrCode.value"
            fit="cover"
            class="aspect-square max-w-full"
            :style="{ width: settings.width }"
          />

        </div>

        <UiButtonGroup
          class="w-full"
          aria-label="Download QR Code"
        >
    

          <UiTooltip>

            <UiTooltipTrigger as-child>
              <UiButton
                variant="secondary"
                size="sm"
                class="flex-1"
                @click.prevent="downloadQRCode('png')"
              >
                <Icon name="lucide:image" />
                PNG
              </UiButton>
            </UiTooltipTrigger>

            <UiTooltipContent>
              Download as PNG
            </UiTooltipContent>

          </UiTooltip>
    
          <UiButtonGroupSeparator class="shrink-0" />

          <UiTooltip>

            <UiTooltipTrigger as-child>
              <UiButton
                variant="secondary"
                size="sm"
                class="flex-1"
                @click.prevent="downloadQRCode('svg')"
              >
                <Icon name="lucide:file-code" />
                SVG
              </UiButton>
            </UiTooltipTrigger>

            <UiTooltipContent>
              Download as SVG
            </UiTooltipContent>

          </UiTooltip>
    
        </UiButtonGroup>
  
        <form
          id="qr-code-settings"
          class="
            grid flex-1 auto-rows-min grid-rows-[auto_auto_1fr] gap-4
            md:grid-cols-2
          "
        >
          <UiField>

            <UiFieldContent>

              <UiFieldLabel for="error-correction-level">
                Error Correction Level
              </UiFieldLabel>

              <UiSelect
                id="error-correction-level"
                v-model:model-value="settings.errorCorrectionLevel"
              >

                <UiSelectTrigger class="w-full">
                  <UiSelectValue />
                </UiSelectTrigger>

                <UiSelectContent>
                  <UiSelectItem
                    v-for="level in errorCorrectionLevels"
                    :key="level.value"
                    :value="level.value"
                  >
                    {{ level.label }}
                  </UiSelectItem>
                </UiSelectContent>

              </UiSelect>

            </UiFieldContent>

          </UiField>

          <UiField>
            <UiFieldContent>

              <UiFieldLabel for="margin">
                Margin
              </UiFieldLabel>

              <UiSlider
                id="margin"
                v-model="settings.margin"
                :min="1"
                :max="16"
              />

            </UiFieldContent>
          </UiField>

          <UiField>
            <UiFieldContent>

              <UiFieldLabel for="width">
                Width
              </UiFieldLabel>

              <UiSlider
                id="width"
                v-model="settings.width"
                :min="1"
                :max="1024"
              />

            </UiFieldContent>
          </UiField>

        </form>
     
      </UiDialogContent>

    </UiDialog>
  </section>
  
</template>
