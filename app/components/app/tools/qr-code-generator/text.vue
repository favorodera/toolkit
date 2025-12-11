<script lang="ts" setup>
const { QRCodeTextData } = storeToRefs(useQRCodeStore())
</script>
  
<template>

  <form
    id="qr-code-text-form"
    class="
      flex flex-1 flex-col
      *:flex-1
    "
  >

    <UiField
      name="text"
      orientation="responsive"
    >

      <UiFieldContent class="flex-1">

        <UiTextarea
          id="text"
          v-model="QRCodeTextData"
          autocomplete="off"
          placeholder="Enter or paste text"
          class="max-h-[calc(100dvh-21rem)] flex-1"
        />

      </UiFieldContent>

    </UiField>

  </form>

</template>
  
  
