<script lang="ts" setup>
import { type MotionProps, stagger } from 'motion-v'

const props = defineProps<{ displayAmount: number | 'all' }>()

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

const tools = computed(() => registry.slice(0, props.displayAmount === 'all' ? registry.length : props.displayAmount))
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
      v-for="tool, key in tools"
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

        <NuxtLink
          :to="tool.path"
          prefetch
        >

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
