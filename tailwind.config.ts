import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base:     '#0a0a0a',
        surface:  '#111111',
        elevated: '#1a1a1a',
        card:     '#161616',
        green:    '#1db954',
        'green-dim': 'rgba(29,185,84,0.15)',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
