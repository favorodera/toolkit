<template>

  <div class="contents">

    <AppHero
      title="The Practical Web Tools you need"
      subtitle="Design, development, and utility tools in one place. No accounts, no tracking, open source."
    >

      <template #actions>
        <UiButton as-child>
          <NuxtLink to="/tools">Explore Toolkit</NuxtLink>
        </UiButton>
      </template>

    </AppHero>

    <AppToolsGrid :registry="Object.fromEntries(Object.entries(toolsRegistry).slice(-6))" />

  </div>

</template>
