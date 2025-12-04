<script lang="ts" setup>
const route = useRoute()

const toolName = computed(() => route.meta.toolName ?? '')
</script>

<template>
  
  <div
    class="
      relative flex min-h-svh flex-col gap-4 px-2 pb-2
      sm:px-4 sm:pb-4
    "
  >
    <AppHeader />

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
