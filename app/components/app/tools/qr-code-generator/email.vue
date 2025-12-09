<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
  
const schema = z.object({
  receiver: z.string('Invalid Input'),
  subject: z.string('Invalid Input'),
  body: z.string('Invalid Input'),
})
  
const { errors: formErrors } = useForm({
  validationSchema: toTypedSchema(schema),
})

const qrCodeData = useState('qr-code-data')
  
const state = reactive<z.output<typeof schema>>({
  receiver: '',
  subject: '',
  body: '',
})

const computedEmail = computed(() => {
  return `mailto:${state.receiver}?subject=${encodeURIComponent(state.subject)}&body=${encodeURIComponent(state.body)}`
})
  
watch([computedEmail, formErrors], ([value, errors]) => {
  qrCodeData.value = Object.keys(errors).length ? ' ' : value
})
</script>
    
<template>
  
  <form
    id="qr-code-text-form"
    class="
      grid flex-1 auto-rows-min grid-rows-[auto_auto_1fr] gap-4
      md:grid-cols-2 md:grid-rows-[auto_1fr]
    "
  >
  
    <VeeField
      v-slot="{ field, errors }"
      v-model="state.receiver"
      name="receiver"
      validate-on-input
    >
  
      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
      >
  
        <UiInput
          autocomplete="email"
          v-bind="field"
          type="email"
          :aria-invalid="!!errors.length"
          placeholder="Receiver Email Address"
        />
  
        <UiFieldError
          v-if="errors.length"
          :errors="errors"
        />
  
      </UiField>
  
    </VeeField>

    <VeeField
      v-slot="{ field, errors }"
      v-model="state.subject"
      name="subject"
      validate-on-input
    >
  
      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
      >
  
        <UiInput
          autocomplete="off"
          v-bind="field"
          type="text"
          :aria-invalid="!!errors.length"
          placeholder="Subject"
        />
  
        <UiFieldError
          v-if="errors.length"
          :errors="errors"
        />
  
      </UiField>
  
    </VeeField>

    <VeeField
      v-slot="{ field, errors }"
      v-model="state.body"
      name="body"
      validate-on-input
    >
  
      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        class="md:col-span-2"
      >
  
        <UiTextarea
          autocomplete="off"
          v-bind="field"
          type="text"
          :aria-invalid="!!errors.length"
          placeholder="Email Body"
          class="max-h-[calc(100dvh-22rem)] flex-1"
        />
  
        <UiFieldError
          v-if="errors.length"
          :errors="errors"
        />
  
      </UiField>
  
    </VeeField>
  
  </form>
  
</template>
      
