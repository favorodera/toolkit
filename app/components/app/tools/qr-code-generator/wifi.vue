<script lang="ts" setup>
const { QRCodeWifiData } = storeToRefs(useQRCodeStore())

const authenticationTypes = [
  { value: 'WPA', label: 'WPA/WPA2' },
  { value: 'WEP', label: 'WEP' },
  { value: 'nopass', label: 'No Password' },
]

const showPassword = ref(false)

</script>

<template>
  <form
    id="qr-code-wifi-form"
    class="
      grid flex-1 auto-rows-min gap-4
      md:grid-cols-2
    "
  >

    <UiField
      name="ssid"
      orientation="responsive"
    >

      <UiFieldTitle>
        SSID
      </UiFieldTitle>

      <UiInput
        id="ssid"
        v-model="QRCodeWifiData.ssid"
        autocomplete="on"
        type="text"
        placeholder="SSID"
      />

    </UiField>
    

    <UiField
      orientation="responsive"
    >

      <UiFieldTitle>
        Authentication
      </UiFieldTitle>

      <UiSelect
        id="authentication"
        v-model="QRCodeWifiData.auth"
      >
        <UiSelectTrigger
          id="authentication"
          class="w-full"
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

    </UiField>


    <UiField
      orientation="responsive"
    >

      <UiFieldTitle>
        Password
      </UiFieldTitle>

      <UiInputGroup>

        <UiInputGroupInput
          id="password"
          v-model="QRCodeWifiData.password"
          autocomplete="current-password"
          :type="showPassword ? 'text' : 'password'"
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
      
    </UiField>


    <UiField
      orientation="horizontal"
    >
      
      <UiFieldTitle>
        Hidden Network
      </UiFieldTitle>

      <UiSwitch
        id="hidden"
        v-model="QRCodeWifiData.hidden"
        name="hidden"
        class="cursor-pointer"
      />
      
    </UiField>

  </form>

</template>
