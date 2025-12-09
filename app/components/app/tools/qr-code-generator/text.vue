<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = toTypedSchema(z.object({
  url: z.string('Invalid input').max(700, 'Input is too long'),
}))

const { errors: formErrors } = useForm({
  validationSchema: schema,
})

const qrCodeData = useState('qr-code-data')

const textareaModel = ref('')

const limits = {
  optimal: 100,
  warning: 200,
  maximum: 500,
}

const textLength = computed(() => textareaModel.value.length)

const limitStatus = computed(() => {
  if (textLength.value <= limits.optimal) return 'optimal'
  if (textLength.value <= limits.warning) return 'warning'
  return 'error'
})

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

        <div class="inline-flex flex-wrap items-center justify-between gap-4">
          <UiFieldError
            v-if="errors.length"
            :errors="errors.slice(0, 1)"
          />

          <p
            class="ml-auto text-sm font-normal"
            :class="{
              'text-green-500': limitStatus === 'optimal',
              'text-yellow-500': limitStatus === 'warning',
              'text-red-500': limitStatus === 'error',
            }"
          >
            {{ textLength }} / {{ limits.maximum }}
          </p>
        </div>

      </UiField>

    </VeeField>

  </form>

</template>
  
  
