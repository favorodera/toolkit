<script lang="ts" setup>
import { type MotionProps, stagger } from 'motion-v'

defineProps<{
  registry: Record<string, {
    name: string
    description: string
    icon: string
    path: string
  }>
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
  <Motion
    initial="initial"
    while-in-view="animate"
    :in-view-options="{ once: true }"
    :variants="animateParent"
    as="div"
    class="
      container mx-auto grid grid-cols-1 items-center gap-4 py-8
      sm:grid-cols-2
      lg:grid-cols-3
    "
  >

    <Motion
      v-for="tool, key in registry"
      :key
      as-child
      :variants="animateChild"
    >

      <UiItem
        variant="outline"
        as-child
        :title="tool.description"
        class="h-full"
      >

        <NuxtLink :to="tool.path">

          <UiItemMedia>
            <Icon
              :name="tool.icon"
              class="size-12"
            />
          </UiItemMedia>

          <UiItemContent>
            <UiItemTitle>{{ tool.name }}</UiItemTitle>
            <UiItemDescription class="line-clamp-1 text-pretty">{{ tool.description }}</UiItemDescription>
          </UiItemContent>

        </NuxtLink>

      </UiItem>

    </Motion>
     

  </Motion>
</template>
