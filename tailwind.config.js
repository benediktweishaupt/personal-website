const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gray: colors.stone,
      },
      fontSize: {
        'base': ['1rem', '1.25rem'],
        'xl': ['1.25rem', '1.625rem'],
      },
      fontFamily: {
        'sans': ['"Relevant"', 'system-ui', 'sans-serif'],
        'serif': ['"SangBleu Republic"', '"Old Standard TT"', 'Georgia', 'Times', 'serif'],
        'serif-display': ['"SangBleu Empire"', '"SangBleu Republic"', 'Georgia', 'Times', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}