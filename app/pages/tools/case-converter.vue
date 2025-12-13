<script lang="ts" setup>
import { useChangeCase, type ChangeCaseType } from '@vueuse/integrations/useChangeCase'

definePageMeta({
  layout: 'tool',
  toolName: 'Text Case Converter',
})

useSeoMeta({ ...toolsSeo('Text Case Converter') })

const mainCaseTypes = ref<ChangeCaseType[]>([
  'noCase',
  'camelCase',
  'pascalCase',
  'pascalSnakeCase',
  'capitalCase',
  'constantCase',
  'dotCase',
  'kebabCase',
  'pathCase',
  'sentenceCase',
  'snakeCase',
  'trainCase',
])

const input = ref('')
const copiedKey = ref<string | number | null>(null)

const output = computed(() => {
  const results = new Map<string, string>()
  const text = input.value.trim()
  const defaultResult = 'Enter text to convert'
  const displayText = text || defaultResult

  mainCaseTypes.value.forEach((type) => {
    results.set(
      useChangeCase(type, type).value,
      useChangeCase(displayText, type).value,
    )
  })

  // Extra conversions
  results.set('lowercase', displayText.toLowerCase())
  results.set('UPPERCASE', displayText.toUpperCase())

  return Object.fromEntries(results.entries())
})

const copy = async (key: string | number, text: string) => {
  const { copy } = useClipboard({ legacy: true })

  await copy(text)

  copiedKey.value = key

  setTimeout(() => {
    copiedKey.value = null
  }, 2000)
}
</script>

<template>
  <section
    class="
      @container relative grid gap-8
      lg:grid-cols-2
    "
  >
    <UiTextarea
      id="case-converter-textarea"
      v-model="input"
      spellcheck
      autocorrect
      class="h-[calc(100dvh-30rem)]"
      placeholder="Type or paste text here ..."
    />

    <div
      class="
        max-h-[calc(100dvh-16rem)] self-start overflow-y-auto rounded-md border
        px-4 pb-4 scrollbar-thin
      "
    >
      <p class="sticky top-0 bg-background py-4 text-lg font-semibold">
        Select Preferred Case
      </p>

      <UiItemGroup class="gap-4">
        <UiItem
          v-for="result, key in output"
          :key
          variant="outline"
          class="flex-nowrap"
        >
          <UiItemContent>
            <UiItemTitle>{{ key }}</UiItemTitle>
            <UiItemDescription class="line-clamp-1 break-all">
              {{ result }}
            </UiItemDescription>
          </UiItemContent>

          <UiItemActions>
            <UiButton
              size="icon-sm"
              variant="outline"
              @click="copy(key, result)"
            >
              <Icon :name="copiedKey === key ? 'lucide:copy-check' : 'lucide:copy'" />
              <span class="sr-only">Copy</span>
            </UiButton>
          </UiItemActions>

        </UiItem>
      </UiItemGroup>

    </div>

  </section>
</template>
