<script setup lang="ts">
const props = defineProps<{
  tabs: Array<{
    value: QRCodeDataType
    icon: string
  }>
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <UiSelect
    id="qr-code-data-type-tabs-minimized"
    v-model="selected"
  >

    <UiSelectTrigger
      size="sm"
      class="ml-2 font-medium text-foreground"
    >
      <Icon
        :name="tabs.find(tab => tab.value === selected)?.icon || 'lucide:sparkles'"
      />
      <UiSelectValue placeholder="OTHERS" />
    </UiSelectTrigger>

    <UiSelectContent>
      <UiSelectItem
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
      >
        <Icon
          :name="tab.icon"
          class="mr-2 size-4"
        />
        {{ tab.value.toLocaleUpperCase() }}
      </UiSelectItem>
    </UiSelectContent>

  </UiSelect>
</template>
