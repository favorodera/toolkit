<script lang="ts" setup>
const inputModel = ref('')

watch(inputModel, (value) => {
  useState('qr-code-data').value = value
})
</script>

<template>

  <UiInput
    id="qr-code-generator-url"
    v-model="inputModel"
    autocomplete="url"
    placeholder="Enter or paste url"
    type="url"
  />

</template>

