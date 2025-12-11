<script lang="ts" setup>
const { QRCodeTelData } = storeToRefs(useQRCodeStore())
</script>
  
<template>
  <form id="qr-code-tel-form">
  
    <UiField
      orientation="responsive"
      name="tel"
    >
  
      <UiFieldContent>
  
        <UiInput
          id="tel"
          v-model="QRCodeTelData"
          autocomplete="tel"
          placeholder="Enter or paste phone number"
          type="tel"
        />
        
      </UiFieldContent>
            
    </UiField>
  
  </form>
</template>
  
  
