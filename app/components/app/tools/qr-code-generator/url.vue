<script lang="ts" setup>
const { QRCodeURLData } = storeToRefs(useQRCodeStore())
</script>

<template>
  <form id="qr-code-url-form">

    <UiField
      orientation="responsive"
    >

      <UiInput
        id="url"
        v-model="QRCodeURLData"
        autocomplete="url"
        placeholder="Enter or paste url"
        type="url"
      />

    </UiField>

  </form>
</template>

