export type FileMetadata = {
  name: string
  size: number
  type: string
  url: string
  id: string
}

export type FileWithPreview = {
  file: File | FileMetadata
  id: string
  preview?: string
}

export type FileUploadOptions = {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  initialFiles?: FileMetadata[]
  onFilesChange?: (files: FileWithPreview[]) => void
  onFilesAdded?: (files: FileWithPreview[]) => void
  onError?: (errors: string[]) => void
}

export default function (options: FileUploadOptions = {}) {
  const {
    maxFiles = Number.POSITIVE_INFINITY, maxSize = Number.POSITIVE_INFINITY, accept = '*', multiple = false, initialFiles = [], onFilesChange, onFilesAdded, onError,
  } = options

  const files = ref<FileWithPreview[]>(
    initialFiles.map(file => ({
      file: markRaw(file), // Prevent deep reactivity on file objects
      id: file.id,
      preview: file.url,
    })),
  )

  const errors = ref<string[]>([])

  const isDragging = ref(false)

  // Debounce error clearing for better UX during rapid operations
  const debouncedClearErrors = useDebounceFn(() => {
    errors.value = []
  }, 300)

  // Cache parsed accept types for better performance
  const acceptedTypes = computed(() => {
    if (accept === '*') return null
    return accept.split(',').map(type => type.trim())
  })

  const ariaLabel = computed(() => {
    if (files.value.length > 0) {
      return multiple ? 'Change files' : 'Change file'
    }
    return multiple ? 'Upload files' : 'Upload file'
  })

  const inputRef = shallowRef<HTMLInputElement | null>(null)
  const dropzoneRef = shallowRef<HTMLElement | null>(null)

  watch(inputRef, (newInput) => {
    if (!newInput) return
    configureInput()
  })

  const configureInput = () => {
    if (!inputRef.value) return
    inputRef.value.type = 'file'
    inputRef.value.className = 'sr-only'
    inputRef.value.accept = accept
    inputRef.value.multiple = multiple
    inputRef.value.hidden = true
    inputRef.value.name = 'file-upload-input'
    inputRef.value.id = 'file-input-' + Math.random().toString(36).substring(2, 9)
    inputRef.value.addEventListener('change', handleFileChange)
  }

  watch(dropzoneRef, (newDropzone) => {
    if (!newDropzone) return
    configureDropzone()
  })

  function configureDropzone() {
    if (!dropzoneRef.value) return
    dropzoneRef.value.addEventListener('dragenter', handleDragEnter)
    dropzoneRef.value.addEventListener('dragleave', handleDragLeave)
    dropzoneRef.value.addEventListener('dragover', handleDragOver)
    dropzoneRef.value.addEventListener('drop', handleDrop)

    dropzoneRef.value.setAttribute('aria-label', ariaLabel.value)
  }

  watch(ariaLabel, (newValue) => {
    if (!dropzoneRef.value) return
    dropzoneRef.value.setAttribute('aria-label', newValue)
  })

  function validateFile(file: File | FileMetadata): string | null {
    if (file instanceof File) {
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
      }
    } else {
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
      }
    }

    const types = acceptedTypes.value
    if (types) {
      const fileType = file instanceof File ? file.type || '' : file.type
      const fileExtension = `.${file instanceof File ? file.name.split('.').pop() : file.name.split('.').pop()}`

      const isAccepted = types.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension.toLowerCase() === type.toLowerCase()
        }
        if (type.endsWith('/*')) {
          const baseType = type.split('/')[0]
          return fileType.startsWith(`${baseType}/`)
        }
        return fileType === type
      })

      if (!isAccepted) {
        return `File "${file instanceof File ? file.name : file.name}" is not an accepted file type.`
      }
    }

    return null
  }

  function createPreview(file: File | FileMetadata): string | undefined {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    return file.url
  }

  function generateUniqueId(file: File | FileMetadata): string {
    if (file instanceof File) {
      return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    return file.id
  }

  function clearFiles() {
    files.value.forEach((file) => {
      if (file.preview && file.file instanceof File && file.file.type.startsWith('image/')) {
        URL.revokeObjectURL(file.preview)
      }
    })

    if (inputRef.value) {
      inputRef.value.value = ''
    }

    files.value = []
    errors.value = []
    onFilesChange?.(files.value)
  }

  function addFiles(newFiles: FileList | File[]) {
    if (!newFiles || newFiles.length === 0) return

    const newFilesArray = Array.from(newFiles)
    const newErrors: string[] = []

    errors.value = []

    if (!multiple) {
      clearFiles()
    }

    if (multiple && maxFiles !== Infinity && files.value.length + newFilesArray.length > maxFiles) {
      newErrors.push(`You can only upload a maximum of ${maxFiles} files.`)
      errors.value = newErrors
      onError?.(newErrors)
      return
    }

    const validFiles: FileWithPreview[] = []

    newFilesArray.forEach((file) => {
      const isDuplicate = files.value.some(
        existingFile => existingFile.file.name === file.name && existingFile.file.size === file.size,
      )

      if (isDuplicate) {
        return
      }

      if (file.size > maxSize) {
        newErrors.push(
          multiple
            ? `Some files exceed the maximum size of ${formatBytes(maxSize)}.`
            : `File exceeds the maximum size of ${formatBytes(maxSize)}.`,
        )
        return
      }

      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
        onError?.(newErrors)
      } else {
        validFiles.push({
          file: markRaw(file), // Prevent deep reactivity on file objects
          id: generateUniqueId(file),
          preview: createPreview(file),
        })
      }
    })

    if (validFiles.length > 0) {
      files.value = !multiple ? validFiles : [...files.value, ...validFiles]
      errors.value = newErrors
      onFilesChange?.(files.value)
      onFilesAdded?.(validFiles)
      onError?.(newErrors)
    } else if (newErrors.length > 0) {
      errors.value = newErrors
      onError?.(newErrors)
    }

    if (inputRef.value) {
      inputRef.value.value = ''
    }
  }

  function removeFile(id: string | undefined) {
    if (!id) return

    const fileToRemove = files.value.find(file => file.id === id)
    if (fileToRemove
      && fileToRemove.preview
      && fileToRemove.file instanceof File
      && fileToRemove.file.type.startsWith('image/')) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    files.value = files.value.filter(file => file.id !== id)
    debouncedClearErrors() // Use debounced version
    onFilesChange?.(files.value)
  }

  function clearErrors() {
    errors.value = []
  }

  function handleDragEnter(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()

    if (dropzoneRef.value) {
      dropzoneRef.value.setAttribute('data-dragging', 'true')
      isDragging.value = true
    }
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget
      && event.relatedTarget
      && (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
      return
    }

    if (dropzoneRef.value) {
      dropzoneRef.value.removeAttribute('data-dragging')
      isDragging.value = false
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()

    if (dropzoneRef.value) {
      dropzoneRef.value.removeAttribute('data-dragging')
      isDragging.value = false
    }

    if (inputRef.value?.disabled) {
      return
    }

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      if (!multiple) {
        const file = event.dataTransfer.files[0]
        if (file) {
          addFiles([file])
        }
      } else {
        addFiles(event.dataTransfer.files)
      }
    }
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      addFiles(target.files)
    }
  }

  function openFileDialog() {
    if (inputRef.value) {
      inputRef.value.click()
    }
  }

  watch(
    files,
    (newFiles) => {
      onFilesChange?.(newFiles)
    },
    { deep: true },
  )

  // Cleanup object URLs on unmount to prevent memory leaks
  onBeforeUnmount(() => {
    files.value.forEach((file) => {
      if (file.preview && file.file instanceof File && file.file.type.startsWith('image/')) {
        URL.revokeObjectURL(file.preview)
      }
    })
  })

  return {
    files: readonly(files), // Make files readonly for external consumers
    errors: readonly(errors),
    addFiles,
    removeFile,
    clearFiles,
    clearErrors,
    handleFileChange,
    openFileDialog,
    onFilesAdded,
    inputRef,
    dropzoneRef,
    isDragging: readonly(isDragging),
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const kiloByte = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const index = Math.floor(Math.log(bytes) / Math.log(kiloByte))

  return Number.parseFloat((bytes / Math.pow(kiloByte, index)).toFixed(dm)) + (sizes[index] || '')
}

