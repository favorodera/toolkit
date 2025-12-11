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
      name="receiver"
      orientation="responsive"
    >

      <UiFieldContent>

        <UiFieldLabel for="receiver">
          Receiver's Address
        </UiFieldLabel>

        <UiInput
          id="receiver"
          v-model="QRCodeMailData.receiver"
          autocomplete="email"
          type="email"
          placeholder="Receiver Email Address"
        />


      </UiFieldContent>
  
    </UiField>

  
    <UiField
      name="subject"
      orientation="responsive"
    >

      <UiFieldContent>

        <UiFieldLabel for="subject">
          Subject
        </UiFieldLabel>

        <UiInput
          id="subject"
          v-model="QRCodeMailData.subject"
          autocomplete="off"
          type="text"
          placeholder="Subject"
        />


      </UiFieldContent>
  
    </UiField>

  
    <UiField
      name="body"
      class="md:col-span-2"
      orientation="responsive"
    >

      <UiFieldContent>

        <UiFieldLabel for="body">
          Body
        </UiFieldLabel>

        <UiTextarea
          id="body"
          v-model="QRCodeMailData.body"
          autocomplete="off"
          type="text"
          placeholder="Email Body"
          class="max-h-[calc(100dvh-26rem)] flex-1"
        />


      </UiFieldContent>
  
    </UiField>
  
  </form>
  
</template>
      
