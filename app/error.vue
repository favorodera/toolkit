<script lang="ts" setup>
import { stagger } from 'motion-v'
import type { MotionProps } from 'motion-v'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const title = computed(() => props.error.statusMessage ?? 'Error')

useSeoMeta({ title })

const childVariant = ref<MotionProps['variants']>({
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
})

</script>
  
<template>

  <Motion
    initial="initial"
    while-in-view="animate"
    class="
      relative z-10 mx-auto flex min-h-svh w-full flex-col items-center
      justify-center px-2 pb-2 text-center
      *:mx-auto *:not-first:max-w-2xl
      sm:px-4 sm:pb-4
    "
    :in-view-options="{ once: true }"
    :variants="{
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          when: 'beforeChildren',
          delayChildren: stagger(0.12),
        },
      },
    }"
  >

    <div
      class="
        pointer-events-none absolute inset-0
        bg-[radial-gradient(var(--color-border)_1px,transparent_1px)]
        mask-[radial-gradient(ellipse_at_center,#000_50%,transparent_100%)]
        bg-size-[20px_20px]
      "
    />

    <Motion
      :variants="{
        initial: { opacity: 0, scale: 0.8 },
        animate: {
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 150,
            damping: 15,
          },
        },
      }"
      class="mb-8 inline-block"
      as="svg"
      as-child
    >
      <svg
        class="
          h-32 w-32 text-primary/20
          sm:h-48 sm:w-48
        "
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke="currentColor"
          stroke-width="2"
        />
        <path
          d="M70 85 Q70 70 85 70 L115 70 Q130 70 130 85 L130 115 Q130 130 115 130 L85 130 Q70 130 70 115 Z"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
        />
        <circle
          cx="85"
          cy="90"
          r="5"
          fill="currentColor"
        />
        <circle
          cx="115"
          cy="90"
          r="5"
          fill="currentColor"
        />
        <path
          d="M85 115 Q100 105 115 115"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </Motion>

    <Motion
      as="h1"
      :variants="childVariant"
      class="
        mb-3 text-6xl font-bold text-primary
        sm:text-7xl
      "
    >
      {{ error.statusCode }}
    </Motion>

    <Motion
      as="h2"
      :variants="childVariant"
      class="
        mb-4 text-2xl font-semibold tracking-tight
        lg:text-3xl
      "
    >
      {{ title }}
    </Motion>

    <Motion
      as="p"
      :variants="childVariant"
      class="
        mb-8 text-base text-muted-foreground
        sm:text-lg
      "
    >
      Oops! The page you're looking for seems to have wandered off. Don't worry, it happens to
      the best of us.
    </Motion>

    <Motion
      as="div"
      :variants="childVariant"
      class="flex flex-wrap items-center justify-center gap-3"
    >
      <UiButton @click="clearError({ redirect: '/' })">
        <Icon
          name="lucide:home"
        />
        Go Home
      </UiButton>

      <UiButton
        variant="outline"
        @click="clearError({ redirect: '/tools' })"
      >
        <Icon
          name="lucide:tool-case"
        />
        Check Tools Registry
      </UiButton>

    </Motion>

  </Motion>


</template>
