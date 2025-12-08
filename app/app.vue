<script lang="ts" setup>
useSeoMeta({
  titleTemplate: '%siteName %separator %s',
  ogTitle: '%s',
  description: 'Design, development, and utility tools in one place. No accounts, no tracking, open source.',
  ogDescription: 'Design, development, and utility tools in one place. No accounts, no tracking, open source.',
  twitterDescription: 'Design, development, and utility tools in one place. No accounts, no tracking, open source.',
  twitterTitle: '%s',
  twitterSite: '@favorodera',
  twitterCard: 'summary_large_image',
  ogImage: '/logo.svg',
  ogImageAlt: 'Toolkit',
  twitterImageAlt: 'Toolkit',
  twitterImage: '/logo.svg',
})

useHead({
  link: [
    { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    { rel: 'icon', href: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
  ],
})
</script>

<template>
  <div
    class="
      relative flex min-h-svh flex-col px-2 pb-2
      sm:px-4 sm:pb-4
    "
  >
    <div
      class="
        pointer-events-none absolute inset-0 z-0
        bg-[radial-gradient(var(--color-border)_1px,transparent_1px)]
        mask-[radial-gradient(ellipse_closest-side_at_50%_50%,#000_60%,transparent_100%)]
        bg-size-[20px_20px]
      "
    />

    <UiTooltipProvider>
      <NuxtLayout>
        <NuxtPage />
        <UiToaster position="top-center" />
      </NuxtLayout>
    </UiTooltipProvider>

  </div>
</template>
