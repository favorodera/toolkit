<script setup lang="ts">
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string('Invalid input').trim().nonempty('First name is required'),
  lastName: z.string('Invalid input').trim().optional(),
  title: z.string('Invalid input').trim().optional(),
  email: z.email('Invalid email').trim().optional(),
  phoneNumber: z.string('Invalid input').trim().optional(),
  address: z.string('Invalid input').trim().optional(),
  website: z.url('Invalid url').trim().optional(),
  organization: z.string('Invalid input').trim().optional(),
})

const { errors: formErrors, values: formValues } = useForm({
  validationSchema: toTypedSchema(schema),
})

const qrCodeData = useState('qr-code-data')
  
const state = reactive<Partial<z.output<typeof schema>>>({})

</script>

<template>

  <form
    id="qr-code-contact-form"
    class="
      grid flex-1 auto-rows-min gap-4
      md:grid-cols-2
    "
  >

    <VeeField
      v-slot="{ field, errors }"
      v-model="state.title"
      name="title"
      validate-on-input
    >
  
      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Title
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="title"
            v-bind="field"
            type="text"
            :aria-invalid="!!errors.length"
            placeholder="Title"
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
      v-model="state.firstName"
      name="firstName"
      validate-on-input
    >
  
      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            First Name
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="first-name"
            v-bind="field"
            type="text"
            :aria-invalid="!!errors.length"
            placeholder="First Name"
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
      v-model="state.lastName"
      name="lastName"
      validate-on-input
    >
  
      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Last Name
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="family-name"
            v-bind="field"
            type="text"
            :aria-invalid="!!errors.length"
            placeholder="Last Name"
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
      v-model="state.organization"
      name="organization"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Organization
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="organization"
            v-bind="field"
            type="text"
            :aria-invalid="!!errors.length"
            placeholder="Organization"
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
      v-model="state.email"
      name="email"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Email
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="email"
            v-bind="field"
            type="email"
            :aria-invalid="!!errors.length"
            placeholder="Email"
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
      v-model="state.phoneNumber"
      name="phoneNumber"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Phone Number
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="tel"
            v-bind="field"
            type="tel"
            :aria-invalid="!!errors.length"
            placeholder="Phone Number"
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
      v-model="state.address"
      name="address"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Address
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="address"
            v-bind="field"
            type="text"
            :aria-invalid="!!errors.length"
            placeholder="Address"
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
      v-model="state.website"
      name="website"
      validate-on-input
    >

      <UiField
        :data-invalid="!!errors.length"
        :name="field.name"
        orientation="responsive"
      >

        <UiFieldContent>

          <UiFieldLabel :for="field.name">
            Website
          </UiFieldLabel>

          <UiInput
            :id="field.name"
            autocomplete="url"
            v-bind="field"
            type="url"
            :aria-invalid="!!errors.length"
            placeholder="Website"
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

