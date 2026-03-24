const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        gray: {
          50: colors.stone[50], // #fafaf9 — warm
          100: colors.stone[100], // #f5f5f4 — warm
          200: colors.neutral[200], // #e5e5e5 — neutral
          300: colors.neutral[300], // #d4d4d4 — neutral
          400: colors.zinc[400], // #a1a1aa — cool
          500: colors.zinc[500], // #71717a — cool
          600: colors.zinc[600], // #52525b — cool
          700: colors.zinc[700], // #3f3f46 — cool
          800: colors.zinc[800], // #27272a — cool
          900: colors.zinc[900], // #18181b — cool
          950: colors.zinc[950], // #09090b — cool
        },
      },
      fontSize: {
        base: ["1rem", "1.25rem"],
        xl: ["1.25rem", "1.5rem"],
      },
      spacing: {
        page: "var(--page-px)",
      },
      fontFamily: {
        sans: ['"Matter"', "Arial", "system-ui", "sans-serif"],
        serif: [
          '"SangBleu Republic"',
          '"Old Standard TT"',
          "Georgia",
          "Times",
          "serif",
        ],
        mono: ['"MatterMono"', "ui-monospace", "monospace"],
        "serif-display": [
          '"SangBleu Empire"',
          '"SangBleu Republic"',
          "Georgia",
          "Times",
          "serif",
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
