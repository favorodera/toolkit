<script setup lang="ts">
const props = defineProps<{
  dataTypes: Array<{
    type: string
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
        :name="dataTypes.find(type => type.type === selected)?.icon || 'lucide:sparkles'"
      />
      <UiSelectValue placeholder="OTHERS" />
    </UiSelectTrigger>

    <UiSelectContent>
      <UiSelectItem
        v-for="item in dataTypes"
        :key="item.type"
        :value="item.type"
      >
        <Icon
          :name="item.icon"
          class="mr-2 size-4"
        />
        {{ item.type.toLocaleUpperCase() }}
      </UiSelectItem>
    </UiSelectContent>

  </UiSelect>
</template>
