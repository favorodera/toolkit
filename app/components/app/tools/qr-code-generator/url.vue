<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = toTypedSchema(z.object({
  url: z.url('Invalid URL'),
}))

const { errors: formErrors } = useForm({
  validationSchema: schema,
})

const qrCodeData = useState('qr-code-data')

const inputModel = ref('')

watch([inputModel, formErrors], ([value, errors]) => {
  qrCodeData.value = Object.keys(errors).length ? ' ' : value
})
</script>

<template>
  <form id="qr-code-url-form">

    <VeeField
      v-slot="{ field, errors }"
      v-model="inputModel"
      name="url"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
      >
        <UiInput
          autocomplete="url"
          placeholder="Enter or paste url"
          type="url"
          v-bind="field"
          :aria-invalid="!!errors.length"
        />

        <UiFieldError
          v-if="errors.length"
          :errors="errors"
        />
      </UiField>

    </VeeField>

  </form>
</template>

