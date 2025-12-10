<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = z.object({
  ssid: z.string('Invalid input').nonempty('SSID is required').trim(),
  authentication: z.enum(['WPA', 'WEP', 'nopass'], 'Invalid authentication'),
  password: z.string('Invalid input').trim().optional(),
  hidden: z.boolean('Invalid input'),
})

const { errors: formErrors, values: formValues } = useForm({
  validationSchema: toTypedSchema(schema),
})

const authenticationTypes = [
  { value: 'WPA', label: 'WPA/WPA2' },
  { value: 'WEP', label: 'WEP' },
  { value: 'nopass', label: 'No Password' },
]
const qrCodeData = useState('qr-code-data')

const state = reactive<Partial<z.output<typeof schema>>>({
  authentication: 'WPA',
  hidden: false,
})

const showPassword = ref(false)

watch([formErrors, formValues], ([errors, values]) => {
  const { ssid, authentication, hidden, password } = values

  if (Object.keys(errors).length || !ssid || !authentication) {
    qrCodeData.value = undefined
  } else {
    const needsPassword = authentication !== 'nopass' && password
    const passwordString = needsPassword ? `P:${password};` : ''
    qrCodeData.value = `WIFI:T:${authentication};S:${ssid};${passwordString}${hidden ? 'H:true;' : ''};`
  }
})

</script>

<template>
  <form
    id="qr-code-wifi-form"
    class="
      grid flex-1 auto-rows-min grid-rows-[auto_auto_1fr] gap-4
      md:grid-cols-2
    "
  >

    <VeeField
      v-slot="{ field, errors }"
      v-model="state.ssid"
      name="ssid"
      validate-on-input
    >
  
      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            SSID
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="on"
            v-bind="field"
            type="text"
            :aria-invalid="!!errors.length"
            placeholder="SSID"
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
      v-model="state.authentication"
      name="authentication"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Authentication
          </UiFieldLabel>

          <UiSelect
            :id="field.name"
            :name="field.name"
            :model-value="field.value"
            @update:model-value="field.onChange"
          >
            <UiSelectTrigger
              :id="field.name"
              class="w-full"
              :aria-invalid="!!errors.length"
            >
              <UiSelectValue placeholder="Authentication" />
            </UiSelectTrigger>

            <UiSelectContent position="item-aligned">
              <UiSelectItem
                v-for="authenticationType in authenticationTypes"
                :key="authenticationType.value"
                :value="authenticationType.value"
              >
                {{ authenticationType.label }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>

          <UiFieldError
            v-if="errors.length"
            :errors="errors.slice(0, 1)"
          />

        </UiFieldContent>


      </UiField>

    </VeeField>

    <VeeField
      v-slot="{ field, errors }"
      v-model="state.password"
      name="password"
      validate-on-input
    >
  
      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Password
          </UiFieldLabel>

          <UiInputGroup>

            <UiInputGroupInput
              :id="field.name"
              autocomplete="current-password"
              v-bind="field"
              :type="showPassword ? 'text' : 'password'"
              :aria-invalid="!!errors.length"
              placeholder="Password"
            />

            <UiInputGroupAddon align="inline-end">
              <UiButton
                variant="ghost"
                size="icon"
                @click.prevent="showPassword = !showPassword"
              >
                <Icon :name="showPassword ? 'lucide:eye' : 'lucide:eye-off'" />
              </UiButton>
            </UiInputGroupAddon>

          </UiInputGroup>
         

          <UiFieldError
            v-if="errors.length"
            :errors="errors.slice(0, 1)"
          />

        </UiFieldContent>
  
      </UiField>
  
    </VeeField>

    <VeeField
      v-slot="{ field, errors }"
      v-model="state.hidden"
      name="hidden"
      validate-on-input
    >

      <UiField
        orientation="horizontal"
        :data-invalid="!!errors.length"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Hidden Network
          </UiFieldLabel>

          <UiSwitch
            :id="field.name"
            :name="field.name"
            :model-value="field.value"
            :aria-invalid="!!errors.length"
            class="cursor-pointer"
            @update:model-value="field.onChange"
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
