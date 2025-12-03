<script lang="ts" setup>

defineProps<{
  registry: {
    name: string
    description: string
    icon: string
    path: string
  }[]
}>()
</script>

<template>
  <section class="w-full">

    <div
      class="
        container mx-auto grid grid-cols-1 items-center gap-4 py-8
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >

      <UiItem
        v-for="tool, index in registry"
        :key="index"
        variant="outline"
        as-child
        :title="tool.description"
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
            <UiItemDescription class="line-clamp-2">{{ tool.description }}</UiItemDescription>
          </UiItemContent>

        </NuxtLink>

      </UiItem>

    </div>

  </section>
</template>
