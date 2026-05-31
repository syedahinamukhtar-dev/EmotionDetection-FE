import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        card: "#12121a",
        border: "#1e1e2e",
        primary: "#6c63ff",
        success: "#10b981",
        warning: "#f59e0b",
        text: "#e2e8f0",
        muted: "#64748b",
        angry: "#ef4444",
        disgust: "#84cc16",
        fear: "#8b5cf6",
        happy: "#facc15",
        neutral: "#94a3b8",
        sad: "#3b82f6",
        surprise: "#f97316",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
