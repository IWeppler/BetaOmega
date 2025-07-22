// tailwind.config.ts
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        brutal: ["Gasoek One", "sans-serif"],
        "brutal-mono": ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brutal: "6px 6px 0px 0px #111111",
        "brutal-lg": "8px 8px 0px 0px #111111",
        "brutal-xl": "12px 12px 0px 0px #111111",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'h1': {
              fontSize: theme('fontSize.3xl'),
              fontWeight: '700',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            'h2': {
              fontSize: theme('fontSize.2xl'),
              fontWeight: '600',
              marginTop: '1.25em',
              marginBottom: '0.5em',
            },
            'h3': {
              fontSize: theme('fontSize.xl'),
              fontWeight: '600',
            },
            'h4': {
              fontSize: theme('fontSize.lg'),
              fontWeight: '600',
            },
            // Puedes personalizar cualquier otro elemento aquí
            'ul > li::marker': {
              color: theme('colors.indigo.500'),
            },
          },
        },
      }),
    },
  },
  plugins: [animatePlugin, typography],
};

export default config;
