<script lang="ts" setup>
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

definePageMeta({
  layout: 'tool',
  toolName: 'Word Counter',
})

useSeoMeta({
  title: () => toolsRegistry['wordCounter'].name,
  description: () => toolsRegistry['wordCounter'].description,
  ogTitle: () => toolsRegistry['wordCounter'].name,
  ogDescription: () => toolsRegistry['wordCounter'].description,
  twitterTitle: () => toolsRegistry['wordCounter'].name,
  twitterDescription: () => toolsRegistry['wordCounter'].description,
})

const input = ref('')

const output = computed(() => {
  // Count words (split by whitespace and filter empty strings)
  const words = input.value.trim() ? input.value.trim().split(/\s+/).length : 0

  // Count all characters including spaces
  const characters = input.value.length

  // Count special characters (non-alphanumeric, non-whitespace)
  const specialCharacters = (input.value.match(/[^a-zA-Z0-9\s]/g) || []).length

  // Count paragraphs (split by double line breaks)
  const paragraphs = input.value.trim() ? input.value.split(/\n\s*\n/).filter(p => p.trim()).length : 0

  function topWords() {
    if (!input.value.trim()) return []
    
    // Extract words and count frequency
    const wordList = input.value.toLowerCase().match(/\b[a-z]+\b/g) || []
    const frequency = new Map<string, number>()
    
    wordList.forEach((word) => {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    })
    
    // Sort by frequency and return top 10
    return Array.from(frequency.entries())
      .sort((entryA, entryB) => entryB[1] - entryA[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))
  }

  return {
    words,
    characters,
    specialCharacters,
    paragraphs,
    topWords,
  }
})

</script>

<template>
  <div class="@container relative grid">

    <div
      class="
        grid rounded-t-md border
        @max-md:divide-y
        @md:grid-cols-2
        @4xl:grid-cols-4
      "
    >

      <div
        v-for="value, key in reactiveOmit(output, 'topWords')"
        :key
        class="
          flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left
          sm:px-8 sm:py-6
          @md:first:border-b @md:even:border-l @md:nth-[2]:border-r
          @md:nth-[2]:border-b
        "
      >

        <span class="text-xs text-muted-foreground uppercase">{{ useChangeCase(key, 'sentenceCase') }}</span>

        <span
          class="
            text-lg leading-none font-bold
            sm:text-3xl
          "
        >
          {{ value }}
        </span>

      </div>

    </div>

    <UiTextarea
      id="text-counter-textarea"
      v-model="input"
      spellcheck
      autocorrect
      class="h-[calc(100dvh-20rem)] rounded-t-none"
      placeholder="Type or paste text here ..."
    />

    <UiDialog>

      <UiDialogTrigger v-if="output.words">
          
        <UiTooltip>

          <UiTooltipTrigger as-child>

            <UiButton
              size="icon"
              class="absolute right-4 bottom-4"
              variant="outline"
            >
              <Icon name="lucide:chart-no-axes-column-increasing" />
            </UiButton>

          </UiTooltipTrigger>
            
          <UiTooltipContent>
            <p>Top 10 words</p>
          </UiTooltipContent>

        </UiTooltip>

      </UiDialogTrigger>

      <UiDialogContent class="sm:max-w-3xl">

        <UiDialogHeader>
          <UiDialogTitle class="flex gap-1">
            <Icon
              name="lucide:chart-no-axes-column-increasing"
              class="h-lh"
            />
            Top 10 Words
          </UiDialogTitle>
        </UiDialogHeader>

        <UiItemGroup>

          <UiItem class="mb-2 w-full justify-between gap-4 p-0">

            <UiItemContent>
              <UiItemTitle class="flex w-full justify-between gap-4">
                <span>Word</span>
                <span>Count</span>
              </UiItemTitle>
            </UiItemContent>

          </UiItem>

          <UiItem
            v-for="words, index in output.topWords()"
            :key="index"
            variant="outline"
            size="sm"
            class="mt-1 w-full p-2 capitalize"
          >
            <UiItemContent>
              <UiItemTitle class="flex w-full justify-between gap-4">
                <span>{{ words.word }}</span>
                <span>{{ words.count }}</span>
              </UiItemTitle>
            </UiItemContent>
          </UiItem>

        </UiItemGroup>

      </UiDialogContent>

    </UiDialog>

  </div>
</template>
