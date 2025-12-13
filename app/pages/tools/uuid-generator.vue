<script lang="ts" setup>
definePageMeta({
  layout: 'tool',
  toolName: 'UUID Generator',
})

useSeoMeta({ ...toolsSeo('UUID Generator') })

const tabs = ref<Array<keyof UUID>>([
  'v1',
  'v3',
  'v4',
  'v5',
  'v6',
  'v7',
])

const getTabClass = (index: number) => {
  if (index < 2) return ''
  if (index < 4) return 'hidden sm:flex'
  if (index < 5) return 'hidden md:flex'
  return 'hidden lg:flex'
}

const contentComponents = [

]

const { UUIDVersion } = storeToRefs(useUUIDStore())
</script>

<template>
  <section class="relative">

    <UiTabs
      v-model="UUIDVersion"
      class="h-[calc(100dvh-16rem)]"
    >
      
      <UiTabsList class="w-full">

        <UiTabsTrigger
          v-for="tab, index in tabs"
          :key="tab"
          :value="tab"
          :class="getTabClass(index)"
        >
          <Icon name="lucide:hash" />
          UUID{{ tab.toUpperCase() }}
        </UiTabsTrigger>

      </UiTabsList>

      <UiTabsContent
        v-for="tab, index in tabs"
        :key="index"
        :value="tab"
        class="
          relative scrollbar-hidden flex max-h-[calc(100dvh-14rem)] flex-1
          flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-md border
          border-border p-4
        "
      >
        <AnimatePresence mode="wait">
          <Motion
            :key="UUIDVersion"
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

  </section>

</template>
