<script lang="ts" setup>
import { stagger, type MotionProps } from 'motion-v'

defineProps<{
  title: string
  subtitle?: string
}>()

const animateParent = ref<MotionProps['variants']>({
  initial: {},
  animate: {
    transition: {
      when: 'beforeChildren',
      delayChildren: stagger(0.12),
    },
  },
})

const animateChild = ref<MotionProps['variants']>({
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
  <section>

    <Motion
      initial="initial"
      while-in-view="animate"
      :in-view-options="{ once: true }"
      :variants="animateParent"
      as="div"
      class="
        container mx-auto flex flex-col items-center gap-2 py-8 text-center
        md:py-16
        lg:py-20
        xl:gap-4
      "
    >

      <Motion
        as="h1"
        :variants="animateChild"
        class="
          max-w-4xl text-4xl leading-tight font-semibold tracking-tight
          text-balance text-primary
          lg:leading-[1.1] lg:font-semibold
          xl:text-5xl xl:tracking-tighter
        "
      >
        {{ title }}
      </Motion>

      <Motion
        v-if="subtitle"
        as="p"
        :variants="animateChild"
        class="
          max-w-3xl text-base text-balance text-foreground
          sm:text-lg
        "
      >
        {{ subtitle }}
      </Motion>

      <Motion
        as="div"
        :variants="animateChild"
        class="flex w-full items-center justify-center gap-2 pt-2"
      >

        <slot name="actions" />

      </Motion>

    </Motion>

  </section>

</template>
