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
        primary: '#BEADFA',
        secondary: '#D0BFFF',
        thirdly: '#DFCCFB',
        yellow: '#FFF8C9'
      }
    },
  },
  plugins: [],
}
export default config
