<script lang="ts" setup>
definePageMeta({
  layout: 'tools',
})

useSeoMeta({
  title: 'Tools Registry',
})
</script>

<template>
  <section>
    <AppHero
      title="Tools Registry"
    />

    <AppToolsGrid :display-amount="'all'" />
  </section>
</template>
