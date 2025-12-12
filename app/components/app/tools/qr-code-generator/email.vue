<script lang="ts" setup>
const { QRCodeMailData } = storeToRefs(useQRCodeStore())
</script>
    
<template>
  
  <form
    id="qr-code-email-form"
    class="
      grid flex-1 auto-rows-min grid-rows-[auto_auto_1fr] gap-4
      md:grid-cols-2 md:grid-rows-[auto_1fr]
    "
  >
  
    <UiField
      orientation="responsive"
    >

      <UiFieldTitle>
        Receiver's Address
      </UiFieldTitle>

      <UiInput
        id="receiver"
        v-model="QRCodeMailData.receiver"
        autocomplete="email"
        type="email"
        placeholder="Receiver Email Address"
      />

    </UiField>

  
    <UiField
      orientation="responsive"
    >

      <UiFieldTitle>
        Subject
      </UiFieldTitle>

      <UiInput
        id="subject"
        v-model="QRCodeMailData.subject"
        autocomplete="off"
        type="text"
        placeholder="Subject"
      />

  
    </UiField>

  
    <UiField
      class="md:col-span-2"
      orientation="responsive"
    >

      <UiFieldTitle>
        Body
      </UiFieldTitle>

      <UiTextarea
        id="body"
        v-model="QRCodeMailData.body"
        autocomplete="off"
        type="text"
        placeholder="Email Body"
        class="max-h-[calc(100dvh-26rem)] flex-1"
      />

  
    </UiField>
  
  </form>
  
</template>
      
