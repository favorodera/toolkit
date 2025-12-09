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

const dataType = ref<typeof dataTypes[number]['type']>('url')
  
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
    class="relative"
  >
  
    <UiTabs
      v-model="dataType"
      class="h-[calc(100dvh-14rem)]"
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
          relative flex max-h-[calc(100dvh-14rem)] flex-1 flex-col gap-4
          rounded-md border border-border p-4
        "
      >

        <KeepAlive>
          <component :is="dataTypeComponents[index]" />
        </KeepAlive>

        <UiDrawer>

          <UiDrawerTrigger
            as-child
            class="absolute right-8 bottom-8 z-1"
          >
            <UiButton
              variant="secondary"
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
