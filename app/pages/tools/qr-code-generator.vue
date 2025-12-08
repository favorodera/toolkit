<script lang="ts" setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { LazyAppToolsQrCodeGeneratorTextOrUrl } from '#components'
import { useChangeCase } from '@vueuse/integrations/useChangeCase.js'
  
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
  
const dataTypes = [
  { type: 'text-or-url', icon: 'lucide:link-2' },
  // { type: 'email', icon: 'lucide:mail' },
  // { type: 'wifi', icon: 'lucide:wifi' },
]
  
const dataTypeComponents = [
  LazyAppToolsQrCodeGeneratorTextOrUrl,
  // LazyAppToolsQrCodeGeneratorEmail,
  // LazyAppToolsQrCodeGeneratorWifi,
]
  
const qrCode = useQRCode(qrCodeData)
  
</script>
  
<template>
  
  <section
    class="
      @container relative flex w-full flex-col-reverse gap-8
      md:flex-row
    "
  >
  
    <UiTabs
      default-value="text-or-url"
      class="flex-1"
      :unmount-on-hide="false"
    >
  
      <UiTabsList class="w-full">
  
        <UiTabsTrigger
          v-for="dataType, index in dataTypes"
          :key="index"
          :value="dataType.type"
        >
          <Icon :name="dataType.icon" />
          {{ useChangeCase(dataType.type, 'sentenceCase') }}
        </UiTabsTrigger>
  
      </UiTabsList>
  
      <UiTabsContent
        v-for="dataType, index in dataTypes"
        :key="index"
        :value="dataType.type"
        class="*:h-full"
      >
        <KeepAlive>
          <component :is="dataTypeComponents[index]" />
        </KeepAlive>
        
      </UiTabsContent>
  
    </UiTabs>
     
  
    <UiCard class="max-w-2xs flex-1 shrink-0">
  
      <UiCardContent>
  
        <NuxtImg
          :src="qrCode"
          alt="Qr Code"
          object="fit"
          class="size-full"
        />
  
      </UiCardContent>
  
    </UiCard>
    
  </section>
  
</template>
