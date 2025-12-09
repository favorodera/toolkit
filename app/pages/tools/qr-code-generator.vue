<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { LazyAppToolsQrCodeGeneratorEmail, LazyAppToolsQrCodeGeneratorText, LazyAppToolsQrCodeGeneratorUrl, LazyAppToolsQrCodeGeneratorWifi } from '#components'
  
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

const qrCodeData = useState('qr-code-data', () => ' ')
  
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
  
const dataTypeComponents = [
  LazyAppToolsQrCodeGeneratorUrl,
  LazyAppToolsQrCodeGeneratorText,
  LazyAppToolsQrCodeGeneratorEmail,
  LazyAppToolsQrCodeGeneratorWifi,
]

const errorCorrectionLevels = ref([
  { label: 'Low (≈7%)', value: 'L' },
  { label: 'Medium (≈15%)', value: 'M' },
  { label: 'Quartile (≈25%)', value: 'Q' },
  { label: 'High (≈30%)', value: 'H' },

])
const errorCorrectionLevel = ref('H')

const qrCode = useQRCode(qrCodeData)
  
</script>
  
<template>
  
  <section
    class="@container relative"
  >
  
    <UiTabs
      default-value="url"
      :unmount-on-hide="false"
    >
  
      <UiTabsList
        class="
          w-full
          *:cursor-pointer
        "
      >
  
        <UiTabsTrigger
          v-for="dataType, index in dataTypes"
          :key="index"
          :value="dataType.type"
        >
          <Icon :name="dataType.icon" />
          {{ dataType.type.toLocaleUpperCase() }}
        </UiTabsTrigger>
  
      </UiTabsList>
  
      <UiTabsContent
        v-for="dataType, index in dataTypes"
        :key="index"
        :value="dataType.type"
        class="
          relative flex max-h-[calc(100dvh-20rem)] min-h-[calc(100dvh-20rem)]
          flex-col gap-4 rounded-md border border-border p-4
        "
      >

        <KeepAlive>
          <component :is="dataTypeComponents[index]" />
        </KeepAlive>

        <UiDrawer>

          <UiDrawerTrigger
            as-child
            class="absolute right-4 bottom-4 z-1"
          >
            <UiButton
              variant="outline"
              size="icon-lg"
            >
              <Icon name="lucide:qr-code" />
            </UiButton>
          </UiDrawerTrigger>

          <UiDrawerContent>

            <div class="mx-auto w-full max-w-sm">

              <UiDrawerHeader>
                <UiDrawerTitle>Preview QR Code</UiDrawerTitle>
              </UiDrawerHeader>
            
              <div class="flex flex-col gap-4 p-4">

                <div class="rounded-md border border-border p-4">

                  <NuxtImg
                    :src="qrCode"
                    fit="cover"
                    class="size-full"
                  />

                </div>
                
                <UiSelect
                  v-model:model-value="errorCorrectionLevel"
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
              </div>

            </div>
           
          </UiDrawerContent>

        </UiDrawer>
        
      </UiTabsContent>
  
    </UiTabs>
    
  </section>
  
</template>
