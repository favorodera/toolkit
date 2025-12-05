<template>
  <header
    class="
      sticky top-0 z-50 flex h-(--header-height) w-full items-center
      justify-between gap-4 bg-background
    "
  >

    <UiButton
      variant="ghost"
      class="text-lg font-bold"
      as-child
    >
      <NuxtLink to="/">
        <Icon
          name="lucide:tool-case"
          class="size-5"
        />
        TOOLKIT
      </NuxtLink>
     
    </UiButton>

    <slot name="right" />

  </header>
</template>
