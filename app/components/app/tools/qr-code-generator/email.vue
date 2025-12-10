<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
  
const schema = z.object({
  receiver: z
    .email('Invalid Email')
    .max(254, 'Email is too long')
    .trim(),
  subject: z
    .string('Invalid input')
    .max(200, 'Subject is too long')
    .trim(),
  body: z
    .string('Invalid input')
    .max(500, 'Body is too long')
    .trim(),
})
  .partial()
  .refine(({ receiver, subject, body }) => {
    const mailtoString = `mailto:${receiver}?subject=${subject}&body=${body}`
    return mailtoString.length <= 800
  }, {
    message: 'Email content is too long',
    path: ['body'],
  })
  
const { errors: formErrors, values: formValues } = useForm({
  validationSchema: toTypedSchema(schema),
})

const qrCodeData = useState('qr-code-data')
  
const state = reactive<Partial<z.output<typeof schema>>>({})
  
watch([formValues, formErrors], ([values, errors]) => {
  const { receiver, subject, body } = values

  if (Object.keys(errors).length || !receiver) {
    qrCodeData.value = undefined
  } else {
    const params = []
    
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
    if (body) params.push(`body=${encodeURIComponent(body)}`)

    const queryString = params.length > 0 ? `?${params.join('&')}` : ''
    
    qrCodeData.value = `mailto:${receiver}${queryString}`
  }
})
</script>
    
<template>
  
  <form
    id="qr-code-email-form"
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
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Receiver's Address
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="email"
            v-bind="field"
            type="email"
            :aria-invalid="!!errors.length"
            placeholder="Receiver Email Address"
          />

          <UiFieldError
            v-if="errors.length"
            :errors="errors.slice(0, 1)"
          />

        </UiFieldContent>
  
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
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Subject
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="off"
            v-bind="field"
            type="text"
            :aria-invalid="!!errors.length"
            placeholder="Subject"
          />
          <UiFieldError
            v-if="errors.length"
            :errors="errors.slice(0, 1)"
          />

        </UiFieldContent>
  
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
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Body
          </UiFieldLabel>

          <UiTextarea
            :id="field.name"
            autocomplete="off"
            v-bind="field"
            type="text"
            :aria-invalid="!!errors.length"
            placeholder="Email Body"
            class="max-h-[calc(100dvh-26rem)] flex-1"
          />

          <UiFieldError
            v-if="errors.length"
            :errors="errors.slice(0, 1)"
          />

        </UiFieldContent>
  
      </UiField>
  
    </VeeField>
  
  </form>
  
</template>
      
