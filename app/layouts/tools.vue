<script lang="ts" setup>
const isCommandOpen = ref(false)

const route = useRoute()

const toolName = computed(() => route.meta.toolName ?? '')
</script>

<template>
  
  <div
    class="
      relative flex min-h-svh flex-col gap-4 px-2
      sm:px-4
    "
  >
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
            Search Tools...
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
        
        <UiCommandDialog v-model:open="isCommandOpen">

          <UiCommandInput placeholder="Search tools..." />

          <UiCommandList>
            
            <UiCommandEmpty>No results found.</UiCommandEmpty>

            <UiCommandGroup heading="Tools">

              <UiCommandItem
                v-for="tool in toolsRegistry"
                :key="tool.name"
                :value="tool.name"
                as-child
              >
                <NuxtLink :to="tool.path">
                  {{ tool.name }}
                </NuxtLink>
              </UiCommandItem>
              
            </UiCommandGroup>

          </UiCommandList>

        </UiCommandDialog>

      </template>

    </AppHeader>

    <main class="container mx-auto flex flex-1 flex-col gap-6">

      <div class="mr-auto flex items-center gap-4">

        <UiButton
          as-child
          variant="ghost"
          size="icon"
        >
          <NuxtLink to="/tools">
            <Icon
              name="lucide:chevron-left"
              class="size-5"
            />
          </NuxtLink>
        </UiButton>

        <h1 class="text-lg font-semibold">
          {{ toolName }}
        </h1>

      </div>

      <slot />
    </main>

  </div>

</template>
