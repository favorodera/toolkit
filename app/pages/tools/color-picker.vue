<script lang="ts" setup>
definePageMeta({
  layout: 'tool',
  toolName: 'Color Picker',
})

useSeoMeta({
  title: 'Color Picker',
})

</script>

<template>
  <section>
    <div
      class="
        @container relative grid gap-8
        lg:grid-cols-2
      "
    >
  
      <div>

        <!-- PICKER + EYE DROP -->
        <UiInput />

        <!-- IMAGE -->
        <UiInput />


      </div>


      <!-- OUTPUT -->
      <div />

    </div>

  </section>

</template>
