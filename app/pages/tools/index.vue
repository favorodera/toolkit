<script lang="ts" setup>
definePageMeta({
  layout: 'tools',
})

useSeoMeta({
  title: 'Tools Registry',
})
</script>

<template>
  <div>
    <AppHero
      title="Tools Registry"
      class="*:md:py-8 *:lg:py-8"
    />

    <AppToolsGrid :registry="toolsRegistry" />
  </div>
</template>
