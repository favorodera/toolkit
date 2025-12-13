<script lang="ts" setup>
definePageMeta({
  layout: 'tool',
  toolName: 'Password Generator',
})
  
useSeoMeta({ ...toolsSeo('Password Generator') })
  
const state = reactive({
  length: [4],
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
})
  
const password = ref('')
  
const generatePassword = () => {
  if (!import.meta.client) return
  
  let characterPool: string[] = []
  const passwordLength = state.length[0] ?? 4
    
  // Character sets
  const uppercase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  const lowercase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '~', '`', '|', '{', '}', ':', ';', '?', ',', '.', '/', '-']
  
  // Add selected character sets to pool
  if (state.uppercase) characterPool = characterPool.concat(uppercase)
  if (state.lowercase) characterPool = characterPool.concat(lowercase)
  if (state.numbers) characterPool = characterPool.concat(numbers)
  if (state.symbols) characterPool = characterPool.concat(symbols)
  
  // Fallback to lowercase if nothing is selected
  if (characterPool.length === 0) {
    characterPool = lowercase
  }
  
  // Helper function to get cryptographically secure random number
  function getSecureRandom(max: number): number {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return (array[0] ?? 0) % max
  }
  
  // Generate password with guaranteed character diversity
  let result = ''
  const selectedSets: string[][] = []
    
  if (state.uppercase) selectedSets.push(uppercase)
  if (state.lowercase) selectedSets.push(lowercase)
  if (state.numbers) selectedSets.push(numbers)
  if (state.symbols) selectedSets.push(symbols)
  
  // Fallback if nothing selected
  if (selectedSets.length === 0) {
    selectedSets.push(lowercase)
  }
  
  // Ensure at least one character from each selected set
  selectedSets.forEach((set) => {
    const randomIndex = getSecureRandom(set.length)
    result += set[randomIndex]
  })
  
  // Fill remaining length with random characters from pool
  for (let index = result.length; index < passwordLength; index++) {
    const randomIndex = getSecureRandom(characterPool.length)
    result += characterPool[randomIndex]
  }
  
  // Shuffle the password using Fisher-Yates algorithm with crypto
  const characters = result.split('')
  for (let currentIndex = characters.length - 1; currentIndex > 0; currentIndex--) {
    const swapIndex = getSecureRandom(currentIndex + 1)
    const temp = characters[currentIndex]
    characters[currentIndex] = characters[swapIndex] ?? ''
    characters[swapIndex] = temp ?? ''
  }
  
  password.value = characters.join('')
}
  
watch(state, () => generatePassword(), { immediate: true })
  
const { copy, copied, isSupported } = useClipboard({ legacy: true })
  
</script>
  
<template>
  
  <section class="relative flex flex-1 flex-col gap-8">
  
    <div
      class="
        flex w-full flex-col items-end gap-4 rounded-md border border-border p-4
      "
    >
  
      <span
        class="
          min-h-6 w-full text-lg font-semibold text-pretty wrap-break-word
          break-all select-all
          selection:bg-primary selection:text-primary-foreground
        "
      >
        {{ password }}
      </span>
  
      <div class="flex gap-2">
  
        <UiButton
          variant="outline"
          size="icon-sm"
          @click="generatePassword"
        >
          <Icon name="lucide:loader-circle" />
          <span class="sr-only">Regenerate Password</span>
        </UiButton>
  
        <UiButton
          variant="outline"
          size="icon-sm"
          :disabled="!isSupported"
          @click="copy(password)"
        >
          <Icon :name="copied ? 'lucide:copy-check' : 'lucide:copy-plus'" />
          <span class="sr-only">Copy Password</span>
        </UiButton>
  
      </div>
  
    </div>
  
    <form
      id="password-generator-form"
      class="
        grid flex-1 auto-rows-min grid-rows-[auto_auto_1fr] gap-4
        md:grid-cols-2
      "
    >
  
      <UiField>
          
        <UiFieldContent class="flex-none flex-row justify-between">
  
          <UiFieldTitle>Length</UiFieldTitle>
  
          <UiFieldDescription>
            {{ state.length[0] }}
          </UiFieldDescription>
  
        </UiFieldContent>
  
        <UiSlider
          id="length"
          v-model="state.length"
          :min="8"
          :max="128"
          :step="1"
        />
  
      </UiField>
  
      <UiFieldGroup>
  
        <UiFieldSet>
  
          <UiFieldLegend>Character Sets</UiFieldLegend>
  
          <UiFieldGroup
            class="
              gap-2
              sm:flex-row
            "
          >
  
            <UiField
              orientation="horizontal"
              class="*:cursor-pointer"
            >
              <UiCheckbox
                id="uppercase"
                v-model="state.uppercase"
              />
              <UiFieldLabel for="uppercase">
                Uppercase
              </UiFieldLabel>
            </UiField>
  
            <UiField
              orientation="horizontal"
              class="*:cursor-pointer"
            >
              <UiCheckbox
                id="lowercase"
                v-model="state.lowercase"
              />
              <UiFieldLabel for="lowercase">
                Lowercase
              </UiFieldLabel>
            </UiField>
  
            <UiField
              orientation="horizontal"
              class="*:cursor-pointer"
            >
              <UiCheckbox
                id="numbers"
                v-model="state.numbers"
              />
              <UiFieldLabel for="numbers">
                Numbers
              </UiFieldLabel>
            </UiField>
  
            <UiField
              orientation="horizontal"
              class="*:cursor-pointer"
            >
              <UiCheckbox
                id="symbols"
                v-model="state.symbols"
              />
              <UiFieldLabel for="symbols">
                Symbols
              </UiFieldLabel>
            </UiField>
  
          </UiFieldGroup>
  
        </UiFieldSet>
  
      </UiFieldGroup>
  
    </form>
  
  </section>
  
</template>
