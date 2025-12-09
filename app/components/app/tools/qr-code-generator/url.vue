<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = toTypedSchema(z.object({
  url: z.url('Invalid URL format').max(500, 'URL is too long'),
}))

const { errors: formErrors } = useForm({
  validationSchema: schema,
})

const qrCodeData = useState('qr-code-data')

const inputModel = ref('')

const limits = {
  optimal: 100,
  warning: 200,
  maximum: 500,
}

const urlLength = computed(() => inputModel.value.length)

const limitStatus = computed(() => {
  if (urlLength.value <= limits.optimal) return 'optimal'
  if (urlLength.value <= limits.warning) return 'warning'
  return 'error'
})

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
            {{ urlLength }} / {{ limits.maximum }}
          </p>
        </div>
      </UiField>

    </VeeField>

  </form>
</template>

