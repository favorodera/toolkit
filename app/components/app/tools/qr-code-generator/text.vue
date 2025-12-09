<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = toTypedSchema(z.object({
  url: z.string('Invalid Input'),
}))

const { errors: formErrors } = useForm({
  validationSchema: schema,
})

const qrCodeData = useState('qr-code-data')

const textareaModel = ref('')

watch([textareaModel, formErrors], ([value, errors]) => {
  qrCodeData.value = Object.keys(errors).length ? ' ' : value
})
</script>
  
<template>

  <form
    id="qr-code-text-form"
    class="
      flex flex-1 flex-col
      *:flex-1
    "
  >

    <VeeField
      v-slot="{ field, errors }"
      v-model="textareaModel"
      name="url"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
      >

        <UiTextarea
          autocomplete="off"
          v-bind="field"
          :aria-invalid="!!errors.length"
          placeholder="Enter or paste text"
          class="max-h-[calc(100dvh-19rem)] flex-1"
        />

        <UiFieldError
          v-if="errors.length"
          :errors="errors"
        />

      </UiField>

    </VeeField>

  </form>

</template>
  
  
