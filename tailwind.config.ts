import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1920px",
    },
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          lowest: "var(--surface-container-lowest)",
          low: "var(--surface-container-low)",
          container: "var(--surface-container)",
          high: "var(--surface-container-high)",
          highest: "var(--surface-container-highest)",
          variant: "var(--surface-variant)",
        },
        "on-surface": {
          DEFAULT: "var(--on-surface)",
          variant: "var(--on-surface-variant)",
          muted: "var(--on-surface-muted)",
        },
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          on: "var(--on-primary)",
          container: "var(--primary-container)",
          "on-container": "var(--on-primary-container)",
          fixed: "var(--primary-fixed)",
          "on-fixed": "var(--on-primary-fixed)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          on: "var(--on-secondary)",
          container: "var(--secondary-container)",
          "on-container": "var(--on-secondary-container)",
          fixed: "var(--secondary-fixed)",
          "on-fixed": "var(--on-secondary-fixed)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          on: "var(--on-tertiary)",
          container: "var(--tertiary-container)",
          "on-container": "var(--on-tertiary-container)",
        },
        error: {
          DEFAULT: "var(--error)",
          on: "var(--on-error)",
          container: "var(--error-container)",
          "on-container": "var(--on-error-container)",
        },
        product: {
          os: "var(--product-os)",
          ai: "var(--product-ai)",
          pa: "var(--product-pa)",
          ide: "var(--product-ide)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Syne", "sans-serif"],
        text: ["var(--font-text)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        none: "0px",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "9999px",
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        elevated: "var(--shadow-elevated)",
      },
    },
  },
  plugins: [],
};

export default config;
