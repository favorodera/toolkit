<script lang="ts" setup>
</script>

<template>
  <section class="w-full">

    <div
      class="
        container mx-auto grid grid-cols-1 items-center gap-2 py-8
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >

      <UiItem
        v-for="tool, index in toolsRegistry"
        :key="index"
        variant="outline"
        as-child
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
            <UiItemDescription>{{ tool.description }}</UiItemDescription>
          </UiItemContent>

        </NuxtLink>

      </UiItem>

    </div>

  </section>
</template>
