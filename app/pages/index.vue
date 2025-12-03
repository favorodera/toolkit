<template>

  <div class="w-full">

    <AppHero
      title="The Practical Web Tools you need"
      subtitle="Design, development, and utility tools in one place. No accounts, no tracking, open source."
    >

      <template #actions>
        <UiButton><NuxtLink to="/tools">Explore Toolkit</NuxtLink></UiButton>
      </template>

    </AppHero>

    <AppToolsGrid :registry="toolsRegistry.slice(0, 6)" />

  </div>

</template>
