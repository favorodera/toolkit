<script lang="ts" setup>
const isCommandOpen = ref(false)

const { command } = useMagicKeys({
  passive: false,
  aliasMap: {
    command: 'control+k',
  },
  onEventFired(event) {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault()
    }
  },
})

whenever(() => command?.value, () => isCommandOpen.value = true)
</script>

<template>
  
  <div class="flex flex-1 flex-col">
    
    <AppHeader>

      <template #right>

        <UiButton
          variant="outline"
          size="sm"
          class="pr-2"
          @click="isCommandOpen = true"
        >

          <span
            class="
              sr-only
              sm:not-sr-only
            "
          >
            Search Tools Registry
          </span>

          <Icon
            name="lucide:search"
            class="sm:hidden"
          />

          <div
            class="
              flex items-center gap-1.5
              max-sm:hidden
            "
          >
            <UiKbd>⌘</UiKbd>
            <UiKbd>K</UiKbd>
          </div>
        </UiButton>
        
        <UiCommandDialog
          v-model:open="isCommandOpen"
          title="Search Toolkit"
        >

          <UiCommandInput placeholder="Search tools..." />

          <UiCommandList>
            
            <UiCommandEmpty>No results found.</UiCommandEmpty>

            <UiCommandGroup heading="Tools">

              <UiCommandItem
                v-for="tool in toolsRegistry"
                :key="tool.name"
                :value="tool.name"
                as-child
                class="cursor-pointer"
                @select="isCommandOpen = false"
              >
                <NuxtLink :to="tool.path">
                  <Icon :name="tool.icon" />
                  {{ tool.name }}
                </NuxtLink>
              </UiCommandItem>
              
            </UiCommandGroup>

          </UiCommandList>

        </UiCommandDialog>

      </template>

    </AppHeader>

    <main class="flex flex-1 flex-col gap-6">

      <slot />

    </main>

  </div>

</template>
