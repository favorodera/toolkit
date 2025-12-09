<script lang="ts" setup>
const textareaModel = ref('')

watch(textareaModel, (value) => {
  useState('qr-code-data').value = value
})
</script>
  
<template>
  
  <UiTextarea
    id="qr-code-generator-text"
    v-model="textareaModel"
    autocomplete="off"
    placeholder="Enter or paste text"
    class="flex-1"
  />

</template>
  
  
