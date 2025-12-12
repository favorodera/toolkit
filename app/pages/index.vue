<script lang="ts" setup>
const lastSixTools = computed(() => registry.slice(-6))
const newTool = computed(() => registry[registry.length - 1])
</script>
  
<template>
  <div class="contents">
    <AppHero
      title="The Practical Web Tools you need"
      subtitle="Design, development, and utility tools in one place. No accounts, no tracking, open source."
    >
      <template #headline>

        <UiBadge
          v-if="newTool"
          as-child
          variant="secondary"
        >
          <NuxtLink :to="newTool.path">
            <span
              class="flex size-2 animate-pulse rounded-full bg-success"
              title="New"
            />
            New Tool: {{ newTool.name }}
            <Icon name="lucide:arrow-right" />
          </NuxtLink>

        </UiBadge>

      </template>
  
      <template #actions>
        <UiButton as-child>
          <NuxtLink to="/tools">Explore Toolkit</NuxtLink>
        </UiButton>
      </template>
    </AppHero>
  
    <AppToolsGrid :tools="lastSixTools" />
  </div>
</template>
