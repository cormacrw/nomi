import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        nomi: {
          emerald: '#00875a',
          deep: '#006b47',
          ink: '#00472d',
          mint: '#e8fff4',
          cream: '#fcf9f2',
          error: '#ff8a80',
        },
      },
      fontFamily: {
        headline: ['Lexend', 'system-ui', 'sans-serif'],
        sans: ['Lexend', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
