import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070a0d",
        "bg-elevated": "#0e1418",
        "bg-elevated-2": "#121a1f",
        ink: "#e9eef0",
        "ink-soft": "#9aa7ae",
        "ink-faint": "#5d6b72",
        line: "#1c262b",
        "line-bright": "#29373d",
        accent: "#35e0c9",
        "accent-bright": "#6bf2de",
        "accent-soft": "#0e2624",
      },
      fontFamily: {
        display: ["var(--font-chakra)"],
        sans: ["var(--font-plex-sans)"],
        mono: ["var(--font-plex-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
