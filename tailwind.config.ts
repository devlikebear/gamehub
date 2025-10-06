import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff10f0',
        'neon-cyan': '#00f0ff',
        'neon-purple': '#9d00ff',
        'neon-yellow': '#ffff00',
        'neon-green': '#00ff00',
      },
      fontFamily: {
        pixel: ["var(--font-press-start)", "cursive"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ['"Courier New"', "monospace"],
      },
      boxShadow: {
        "neon-pink": "0 0 20px rgba(255, 16, 240, 0.5)",
        "neon-cyan": "0 0 20px rgba(0, 240, 255, 0.5)",
        "neon-purple": "0 0 20px rgba(157, 0, 255, 0.5)",
        "neon-yellow": "0 0 20px rgba(255, 255, 0, 0.5)",
        "neon-green": "0 0 20px rgba(0, 255, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
