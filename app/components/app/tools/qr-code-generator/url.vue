<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = z.object({
  url: z.url('Invalid URL format')
    .max(500, 'URL is too long')
    .trim(),
})

const { errors: formErrors, values: formValues } = useForm({
  validationSchema: toTypedSchema(schema),
})

const qrCodeData = useState('qr-code-data')

const state = reactive<Partial<z.output<typeof schema>>>({})

watch([formErrors, formValues], ([errors, values]) => {
  const { url } = values

  if (Object.keys(errors).length || !url) {
    qrCodeData.value = undefined
    return
  } else {
    qrCodeData.value = url
  }
})
</script>

<template>
  <form id="qr-code-url-form">

    <VeeField
      v-slot="{ field, errors }"
      v-model="state.url"
      name="url"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiInput
            autocomplete="url"
            placeholder="Enter or paste url"
            type="url"
            v-bind="field"
            :aria-invalid="!!errors.length"
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

