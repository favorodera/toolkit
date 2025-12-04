<template>
  
  <div
    class="
      relative flex min-h-svh flex-col px-2 pb-2
      sm:px-4 sm:pb-4
    "
  >
    <AppHeader />

    <main class="flex flex-1 flex-col">
      <slot />
    </main>

  </div>

</template>
