<script lang="ts" setup>
import { LazyAppToolsQrCodeGeneratorContact, LazyAppToolsQrCodeGeneratorEmail, LazyAppToolsQrCodeGeneratorTel, LazyAppToolsQrCodeGeneratorText, LazyAppToolsQrCodeGeneratorUrl, LazyAppToolsQrCodeGeneratorWifi } from '#components'
  
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

const tabs: { value: QRCodeDataType, icon: string }[] = [
  { value: 'url', icon: 'lucide:link-2' },
  { value: 'text', icon: 'lucide:text' },
  { value: 'mail', icon: 'lucide:mail' },
  { value: 'wifi', icon: 'lucide:wifi' },
  { value: 'contact', icon: 'lucide:contact' },
  { value: 'tel', icon: 'lucide:phone' },
]

const getTabClass = (index: number) => {
  if (index < 2) return ''
  if (index < 4) return 'hidden sm:flex'
  if (index < 5) return 'hidden md:flex'
  return 'hidden lg:flex'
}

const contentComponents = [
  LazyAppToolsQrCodeGeneratorUrl,
  LazyAppToolsQrCodeGeneratorText,
  LazyAppToolsQrCodeGeneratorEmail,
  LazyAppToolsQrCodeGeneratorWifi,
  LazyAppToolsQrCodeGeneratorContact,
  LazyAppToolsQrCodeGeneratorTel,
]

const errorCorrectionLevels = ref([
  { label: 'Low (≈7%)', value: 'L' },
  { label: 'Medium (≈15%)', value: 'M' },
  { label: 'Quartile (≈25%)', value: 'Q' },
  { label: 'High (≈30%)', value: 'H' },

])

const { QRCode, QRCodeDataType, validationErrors, validationWarnings, hasWarnings, isValid, QRCodeSettings } = storeToRefs(useQRCodeStore())
  

const { downloadQRCode } = qrCodeHandler()
</script>
  
<template>
  
  <section
    class="relative"
  >
    <UiTabs
      v-model="QRCodeDataType"
      class="h-[calc(100dvh-16rem)]"
    >
      <UiTabsList class="w-full">

        <UiTabsTrigger
          v-for="(tab, index) in tabs"
          :key="tab.value"
          :value="tab.value"
          :class="getTabClass(index)"
        >
          <Icon :name="tab.icon" />
          {{ tab.value.toUpperCase() }}
        </UiTabsTrigger>

        <AppToolsQrCodeGeneratorMobileTabList
          v-model="QRCodeDataType"
          :tabs="tabs.slice(2)"
          class="sm:hidden"
        />

        <AppToolsQrCodeGeneratorMobileTabList
          v-model="QRCodeDataType"
          :tabs="tabs.slice(4)"
          class="
            hidden
            sm:flex
            md:hidden
          "
        />

        <AppToolsQrCodeGeneratorMobileTabList
          v-model="QRCodeDataType"
          :tabs="tabs.slice(5)"
          class="
            hidden
            md:flex
            lg:hidden
          "
        />

      </UiTabsList>

      <UiTabsContent
        v-for="(tab, index) in tabs"
        :key="index"
        :value="tab.value"
        class="
          relative scrollbar-hidden flex max-h-[calc(100dvh-14rem)] flex-1
          flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-md border
          border-border p-4
        "
      >
        <AnimatePresence mode="wait">
          <Motion
            :key="QRCodeDataType"
            :initial="{ opacity: 0, scale: 0.96, y: 20 }"
            :animate="{
              opacity: 1,
              scale: 1,
              y: 0,
            }"
            :exit="{
              opacity: 0,
              scale: 0.96,
              y: -20,
            }"
            :transition="{
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
              scale: { duration: 0.4 },
              y: { duration: 0.35 },
            }"
            class="flex flex-1 flex-col"
          >
            <KeepAlive>
              <component :is="contentComponents[index]" />
            </KeepAlive>
          </Motion>

        </AnimatePresence>

      </UiTabsContent>

    </UiTabs>
    
    <UiDialog>

      <UiDialogTrigger
        as-child
        class="absolute right-8 bottom-8 z-1"
        :class="{
          'text-destructive': !isValid,
          'text-warning': isValid && hasWarnings,
          'text-success': isValid && !hasWarnings,
        }"
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
          :class="{
            'bg-linear-to-b from-muted/50 from-30% to-background': !isValid,
          }"
        >

          <NuxtImg
            v-if="isValid"
            :src="QRCode.value"
            fit="cover"
            class="aspect-square max-w-full"
            :style="{ width: QRCodeSettings.width }"
            alt="QR Code"
          />

          <UiEmpty
            v-else
            class="
              size-full
              **:text-destructive
            "
          >
            <UiEmptyMedia
              variant="icon"
            >
              <Icon name="lucide:alert-circle" />
            </UiEmptyMedia>

            <UiEmptyHeader>
              <UiEmptyTitle>Cannot Generate</UiEmptyTitle>
              <UiEmptyDescription>Fix validation errors</UiEmptyDescription>
            </UiEmptyHeader>

          </UiEmpty>

        </div>

        <ul
          v-if="!isValid"
          class="text-xs text-destructive"
        >
          <li
            v-for="error in validationErrors.slice(-2)"
            :key="error"
            class="flex items-center gap-1"
          >
            <Icon
              name="lucide:alert-circle"
              class="h-lh"
            />
            {{ error }}
          </li>
        </ul>

        <ul
          v-if="hasWarnings && isValid"
          class="text-xs text-warning"
        >
          <li
            v-for="warning in validationWarnings.slice(-2)"
            :key="warning"
            class="flex items-center gap-1"
          >
            <Icon
              name="lucide:alert-circle"
              class="h-lh"
            />
            {{ warning }}
          </li>

        </ul>

        <UiButtonGroup
          class="w-full"
          aria-label="Download QR Code"
        >
    
          <UiTooltip :disabled="!isValid">

            <UiTooltipTrigger as-child>
              <UiButton
                variant="secondary"
                size="sm"
                class="flex-1"
                :disabled="!isValid"
                @click.prevent="downloadQRCode('png', QRCodeSettings.width, QRCodeDataType, QRCode.value)"
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

          <UiTooltip :disabled="!isValid">

            <UiTooltipTrigger as-child>
              <UiButton
                variant="secondary"
                size="sm"
                class="flex-1"
                :disabled="!isValid"
                @click.prevent="downloadQRCode('svg', QRCodeSettings.width, QRCodeDataType, QRCode.value)"
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
          <UiField name="error-correction-level">

            <UiFieldContent>

              <UiFieldLabel for="error-correction-level">
                Error Correction Level
              </UiFieldLabel>

              <UiSelect
                id="error-correction-level"
                v-model:model-value="QRCodeSettings.errorCorrectionLevel"
              >

                <UiSelectTrigger
                  id="error-correction-level"
                  class="w-full"
                  :disabled="!isValid"
                >
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

          <UiField name="margin">
            <UiFieldContent>

              <UiFieldLabel for="margin">
                Margin
              </UiFieldLabel>

              <UiSlider
                id="margin"
                v-model="QRCodeSettings.margin"
                :min="1"
                :max="16"
                :disabled="!isValid"
              />

            </UiFieldContent>
          </UiField>

          <UiField name="width">
            <UiFieldContent>

              <UiFieldLabel for="width">
                Width
              </UiFieldLabel>

              <UiSlider
                id="width"
                v-model="QRCodeSettings.width"
                :min="1"
                :max="1024"
                :disabled="!isValid"
              />

            </UiFieldContent>
          </UiField>

        </form>
     
      </UiDialogContent>

    </UiDialog>
  </section>
  
</template>
