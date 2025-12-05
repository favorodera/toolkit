<script lang="ts" setup>
const route = useRoute()

const toolName = computed(() => route.meta.toolName ?? '')
</script>

<template>
  
  <div class="flex flex-1 flex-col">
    <AppHeader />

    <main
      class="
        flex flex-1 flex-col pt-6
        md:pt-16
      "
    >
      
      <div
        class="
          relative container mx-auto flex flex-1 flex-col gap-6
          *:relative
        "
      >

        <div class="flex items-center gap-4">

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

      </div>

    </main>

  </div>

</template>
