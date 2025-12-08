<script lang="ts" setup>
const textareaModel = ref(' ')
  
watch(textareaModel, (response) => {
  if (response) {
    qrCodeData.value = response
  }
}, { immediate: true })
</script>
  
<template>
  
  <UiCard class="flex-1">
  
    <UiCardContent class="flex flex-1 flex-col">
  
      <UiTextarea
        id="text-or-url"
        v-model="textareaModel"
        autocomplete="off"
        placeholder="Enter or paste text or url"
        class="h-full"
      />
    
    </UiCardContent>
  
  </UiCard>
  
  
</template>
  
