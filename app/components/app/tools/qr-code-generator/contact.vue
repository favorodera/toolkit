<script lang="ts" setup>
const { QRCodeContactData } = storeToRefs(useQRCodeStore())
</script>
  
<template>
  <form
    id="qr-code-contact-form"
    class="
      grid flex-1 auto-rows-min gap-4
      md:grid-cols-2
    "
  >
  
    <UiField
      name="title"
      orientation="responsive"
    >
      <UiFieldContent>
        <UiFieldLabel for="title">
          Title
        </UiFieldLabel>
  
        <UiInput
          id="title"
          v-model="QRCodeContactData.title"
          autocomplete="honorific-prefix"
          type="text"
          placeholder="Title"
        />
      </UiFieldContent>
    </UiField>
  
    <UiField
      name="firstName"
      orientation="responsive"
    >
      <UiFieldContent>
        <UiFieldLabel for="firstName">
          First Name
        </UiFieldLabel>
  
        <UiInput
          id="firstName"
          v-model="QRCodeContactData.firstName"
          autocomplete="given-name"
          type="text"
          placeholder="First Name"
        />
      </UiFieldContent>
    </UiField>
  
    <UiField
      name="lastName"
      orientation="responsive"
    >
      <UiFieldContent>
        <UiFieldLabel for="lastName">
          Last Name
        </UiFieldLabel>
  
        <UiInput
          id="lastName"
          v-model="QRCodeContactData.lastName"
          autocomplete="family-name"
          type="text"
          placeholder="Last Name"
        />
      </UiFieldContent>
    </UiField>
  
    <UiField
      name="organization"
      orientation="responsive"
    >
      <UiFieldContent>
        <UiFieldLabel for="organization">
          Organization
        </UiFieldLabel>
  
        <UiInput
          id="organization"
          v-model="QRCodeContactData.organization"
          autocomplete="organization"
          type="text"
          placeholder="Organization"
        />
      </UiFieldContent>
    </UiField>
  
    <UiField
      name="email"
      orientation="responsive"
    >
      <UiFieldContent>
        <UiFieldLabel for="email">
          Email
        </UiFieldLabel>
  
        <UiInput
          id="email"
          v-model="QRCodeContactData.email"
          autocomplete="email"
          type="email"
          placeholder="Email"
        />
      </UiFieldContent>
    </UiField>
  
    <UiField
      name="phoneNumber"
      orientation="responsive"
    >
      <UiFieldContent>
        <UiFieldLabel for="phoneNumber">
          Phone Number
        </UiFieldLabel>
  
        <UiInput
          id="phoneNumber"
          v-model="QRCodeContactData.phoneNumber"
          autocomplete="tel"
          type="tel"
          placeholder="Phone Number"
        />
      </UiFieldContent>
    </UiField>
  
    <UiField
      name="address"
      orientation="responsive"
    >
      <UiFieldContent>
        <UiFieldLabel for="address">
          Address
        </UiFieldLabel>
  
        <UiInput
          id="address"
          v-model="QRCodeContactData.address"
          autocomplete="street-address"
          type="text"
          placeholder="Address"
        />
      </UiFieldContent>
    </UiField>
  
    <UiField
      name="website"
      orientation="responsive"
    >
      <UiFieldContent>
        <UiFieldLabel for="website">
          Website
        </UiFieldLabel>
  
        <UiInput
          id="website"
          v-model="QRCodeContactData.website"
          autocomplete="url"
          type="url"
          placeholder="Website"
        />
      </UiFieldContent>
    </UiField>
  
  </form>
</template>
