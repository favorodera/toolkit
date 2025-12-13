import { v1 } from 'uuid'

export type UUID = Record<'v1' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7', string>

export const useUUIDStore = defineStore('uuid-store', () => {

  const UUIDVersion = ref<keyof UUID>('v1')

  const UUID = ref<string>()

  function version1() {
    const result = v1()
    UUID.value = result
  }

  function regenerate(version: keyof UUID) {

    switch (version) {
      case 'v1': {
        version1()
        break
      }
    }

  }

  return {
    version1,
    
    regenerate,

    UUID,
    UUIDVersion,
  }
})
