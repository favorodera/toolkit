<script lang="ts" setup>
defineProps<{
  title:string
  subtitle?:string
}>()
</script>

<template>
  <section>

    <div
      class="
        container mx-auto flex flex-col items-center gap-2 py-8 text-center
        md:py-16
        lg:py-20
        xl:gap-4
      "
    >

      <h1
        class="
          max-w-4xl text-4xl leading-tight font-semibold tracking-tight
          text-balance text-primary
          lg:leading-[1.1] lg:font-semibold
          xl:text-5xl xl:tracking-tighter
        "
      >
        {{ title }}
      </h1>

      <p
      v-if="subtitle"
        class="
          max-w-3xl text-base text-balance text-foreground
          sm:text-lg
        "
      >
       {{ subtitle }}
      </p>

      <div class="flex w-full items-center justify-center gap-2 pt-2">

        <slot name="actions"></slot>

      </div>

    </div>

  </section>
</template>
