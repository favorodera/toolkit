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
      orientation="responsive"
    >
      
      <UiFieldTitle>
        Title
      </UiFieldTitle>
  
      <UiInput
        id="title"
        v-model="QRCodeContactData.title"
        autocomplete="honorific-prefix"
        type="text"
        placeholder="Title"
      />
      
    </UiField>
  
    <UiField
      orientation="responsive"
    >
      
      <UiFieldTitle>
        First Name
      </UiFieldTitle>
  
      <UiInput
        id="firstName"
        v-model="QRCodeContactData.firstName"
        autocomplete="given-name"
        type="text"
        placeholder="First Name"
      />
      
    </UiField>
  
    <UiField
      orientation="responsive"
    >
      
      <UiFieldTitle>
        Last Name
      </UiFieldTitle>
  
      <UiInput
        id="lastName"
        v-model="QRCodeContactData.lastName"
        autocomplete="family-name"
        type="text"
        placeholder="Last Name"
      />
      
    </UiField>
  
    <UiField
      orientation="responsive"
    >
      
      <UiFieldTitle>
        Organization
      </UiFieldTitle>
  
      <UiInput
        id="organization"
        v-model="QRCodeContactData.organization"
        autocomplete="organization"
        type="text"
        placeholder="Organization"
      />
      
    </UiField>
  
    <UiField
      orientation="responsive"
    >
      
      <UiFieldTitle>
        Email
      </UiFieldTitle>
  
      <UiInput
        id="email"
        v-model="QRCodeContactData.email"
        autocomplete="email"
        type="email"
        placeholder="Email"
      />
      
    </UiField>
  
    <UiField
      orientation="responsive"
    >
      
      <UiFieldTitle>
        Phone Number
      </UiFieldTitle>
  
      <UiInput
        id="phoneNumber"
        v-model="QRCodeContactData.phoneNumber"
        autocomplete="tel"
        type="tel"
        placeholder="Phone Number"
      />
      
    </UiField>
  
    <UiField
      orientation="responsive"
    >
      
      <UiFieldTitle>
        Address
      </UiFieldTitle>
  
      <UiInput
        id="address"
        v-model="QRCodeContactData.address"
        autocomplete="street-address"
        type="text"
        placeholder="Address"
      />
      
    </UiField>
  
    <UiField
      orientation="responsive"
    >
      
      <UiFieldTitle>
        Website
      </UiFieldTitle>
  
      <UiInput
        id="website"
        v-model="QRCodeContactData.website"
        autocomplete="url"
        type="url"
        placeholder="Website"
      />
      
    </UiField>
  
  </form>
</template>
