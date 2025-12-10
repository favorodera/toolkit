<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = z.object({
  text: z.string('Invalid input').max(700, 'Text is too long').trim(),
})

const { errors: formErrors, values: formValues } = useForm({
  validationSchema: toTypedSchema(schema),
})

const qrCodeData = useState('qr-code-data')

const state = reactive<Partial<z.output<typeof schema>>>({})

watch([formValues, formErrors], ([values, errors]) => {
  const { text } = values

  if (Object.keys(errors).length || !text) {
    qrCodeData.value = undefined
  } else {
    qrCodeData.value = text
  }
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
      v-model="state.text"
      name="text"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent class="flex-1">

          <UiTextarea
            autocomplete="off"
            v-bind="field"
            :aria-invalid="!!errors.length"
            placeholder="Enter or paste text"
            class="max-h-[calc(100dvh-21rem)] flex-1"
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
  
  
