// tailwind.config.ts
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

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
    },
  },
  plugins: [animatePlugin],
};

export default config;
