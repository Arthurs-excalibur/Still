import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--paper-bg)",
          surface: "var(--paper-surface)",
          hover: "var(--paper-hover)",
          border: "var(--paper-border)",
          text: "var(--paper-text)",
          muted: "var(--paper-muted)",
          accent: "var(--paper-accent)",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-serif)",
          "Newsreader",
          "Playfair Display",
          "Charter",
          "Georgia",
          "Cambria",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        prose: "68ch",
      },
      letterSpacing: {
        tightest: "-0.03em",
        tighter: "-0.02em",
        tight: "-0.01em",
      },
    },
  },
  plugins: [],
};

export default config;

