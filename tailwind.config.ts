import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.ts',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        head: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg:       '#0d0d0f',
        surface:  '#151518',
        surface2: '#1c1c21',
        border:   '#2a2a32',
        accent:   '#e2ff5d',
        accent2:  '#ff5dab',
        muted:    '#52525e',
        ink:      '#e8e8ee',
        ink2:     '#9999aa',
      },
    },
  },
  plugins: [],
} satisfies Config