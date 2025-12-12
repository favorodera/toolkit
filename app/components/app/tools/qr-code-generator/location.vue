<script lang="ts" setup>
const { QRCodeLocationData } = storeToRefs(useQRCodeStore())
</script>

<template>
  <form
    id="qr-code-location-form"
    class="
      grid flex-1 auto-rows-min gap-4
      md:grid-cols-2
    "
  >
  
    <UiField
      orientation="responsive"
    >
      
      <UiFieldTitle>
        Latitude
      </UiFieldTitle>

      <UiNumberField
        id="latitude"
        v-model="QRCodeLocationData.latitude"
        placeholder="40.712776"
        :min="-90"
        :max="90"
        :format-options="{
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        }"
      >

        <UiNumberFieldContent>
          <UiNumberFieldDecrement />
          <UiNumberFieldInput />
          <UiNumberFieldIncrement />
        </UiNumberFieldContent>
      </UiNumberField>
      
    </UiField>

    <UiField
      orientation="responsive"
    >
      
      <UiFieldTitle>
        Longitude
      </UiFieldTitle>

      <UiNumberField
        id="longitude"
        v-model="QRCodeLocationData.longitude"
        placeholder="-74.005974"
        :min="-180"
        :max="180"
        :format-options="{
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        }"
      >

        <UiNumberFieldContent>
          <UiNumberFieldDecrement />
          <UiNumberFieldInput />
          <UiNumberFieldIncrement />
        </UiNumberFieldContent>
      </UiNumberField>
      
    </UiField>

    <UiField
      orientation="responsive"
    >
      <UiFieldContent class="flex-none flex-row justify-between">
      
        <UiFieldTitle>
          Altitude
        </UiFieldTitle>

        <UiFieldDescription>
          Meters
        </UiFieldDescription>

      </UiFieldContent>

      <UiNumberField
        id="altitude"
        v-model="QRCodeLocationData.altitude"
        placeholder="10"
        :format-options="{
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }"
      >

        <UiNumberFieldContent>
          <UiNumberFieldDecrement />
          <UiNumberFieldInput />
          <UiNumberFieldIncrement />
        </UiNumberFieldContent>
      </UiNumberField>
      
    </UiField>
  
  </form>
</template>
