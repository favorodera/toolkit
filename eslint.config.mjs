import withNuxt from './.nuxt/eslint.config.mjs'
import config from '@favorodera/nuxt-eslint-config'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import vueA11y from 'eslint-plugin-vuejs-accessibility'

export default withNuxt()
  .append(config)
  .append(vueA11y.configs['flat/recommended'])
  .append({
    plugins: { 'better-tailwindcss': betterTailwind },
    rules: { ...betterTailwind.configs['recommended-warn'].rules },
    settings: {
      'better-tailwindcss': {
        entryPoint: './app/assets/css/index.css',
      },
    },
  })
