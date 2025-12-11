import withNuxt from './.nuxt/eslint.config.mjs'
import config from '@favorodera/nuxt-eslint-config'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import vueA11y from 'eslint-plugin-vuejs-accessibility'

export default withNuxt()
  .append(config)
  .append({
    plugins: { 'vuejs-accessibility': vueA11y },
    rules: { ...vueA11y.configs['flat/recommended'].rules },
    ignores: ['./app/components/ui/**'],
  })
  .append({
    plugins: { 'better-tailwindcss': betterTailwind },
    rules: {
      ...betterTailwind.configs['recommended-warn'].rules,
      'better-tailwindcss/consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unregistered-classes': ['warn', { ignore: ['toaster', 'scrollbar-hidden', 'text-warning'] }],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: './app/assets/css/index.css',
      },
    },
  })
