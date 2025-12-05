<script lang="ts" setup>
definePageMeta({
  layout: 'tool',
  toolName: 'Color Picker',
})

useSeoMeta({
  title: 'Color Picker',
})

const colorPickerModel = ref('#FFFFFF')

const maxSizeMB = 200
const maxSize = maxSizeMB * 1024 * 1024

const { files, errors, openFileDialog, removeFile, dropzoneRef, inputRef } = useFileUpload({
  accept: 'image/*',
  maxSize,
})

const currentFile = computed(() => files.value?.[0])
</script>

<template>
  <section
    class="
      @container relative grid flex-1 gap-8
      lg:grid-cols-2
    "
  >
  
    <div class="grid grid-rows-5 gap-8">

      <div class="row-span-2 flex flex-col gap-4">

        <UiInput
          v-model="colorPickerModel"
          type="color"
          class="h-3/4"
        />

        <UiInput
          v-model="colorPickerModel"
          type="text"
        />

      </div>


      <div class="row-span-3 flex flex-col gap-2">

        <div class="relative size-full">

          <button
            ref="dropzoneRef"
            class="
              relative flex size-full flex-col items-center justify-center
              overflow-hidden rounded-xl border border-dashed border-input p-4
              transition-colors
              hover:bg-accent/50
              has-disabled:pointer-events-none has-disabled:opacity-50
              has-[img]:border-none
              has-[input:focus]:border-ring has-[input:focus]:ring-[3px]
              has-[input:focus]:ring-ring/50
              data-[dragging=true]:bg-accent/50
            "
            @click="openFileDialog"
            @keypress.space="openFileDialog"
          >
            <input
              ref="inputRef"
              hidden
              aria-label="Upload file"
            >

            <div
              v-if="currentFile"
              class="absolute inset-0"
            >
              <NuxtImg
                :src="currentFile.preview"
                :alt="currentFile.file.name"
                class="size-full object-cover"
              />
            </div>
            
            <div
              v-else
              class="
                flex flex-col items-center justify-center px-4 py-3 text-center
              "
            >
              <div
                class="
                  mb-2 flex size-11 shrink-0 items-center justify-center
                  rounded-full border bg-background
                "
                aria-hidden="true"
              >
                <Icon
                  name="lucide:image-up"
                  class="size-4 opacity-60"
                />
              </div>

              <p class="mb-1.5 text-sm font-medium">
                Pick colors directly from your images
                <br>
                Drag and drop or click to select a file
              </p>

              <p class="text-xs text-muted-foreground">
                Max size: {{ maxSizeMB }}MB
              </p>

            </div>

          </button>

          <div
            v-if="currentFile"
            class="absolute top-3 right-3"
          >
            <button
              type="button"
              class="
                z-50 flex size-8 cursor-pointer items-center justify-center
                rounded-full bg-black/60 text-white
                transition-[color,box-shadow] outline-none
                hover:bg-black/80
                focus-visible:border-ring focus-visible:ring-[3px]
                focus-visible:ring-ring/50
              "
              aria-label="Remove image"
              @click="removeFile(currentFile.id)"
            >
              <Icon
                name="lucide:x"
                class="size-4"
                aria-hidden="true"
              />
            </button>
          </div>

        </div>

        <div
          v-if="errors.length > 0"
          class="flex items-center gap-1 text-xs text-destructive"
          role="alert"
        >
          <Icon
            name="lucide:circle-alert"
            class="size-3 shrink-0"
          />
          <span>{{ errors[0] }}</span>
        </div>

      </div>

    </div>
   

  </section>
</template>
