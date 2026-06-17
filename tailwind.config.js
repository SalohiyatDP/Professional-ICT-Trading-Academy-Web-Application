/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Trading platform palette
        bg: {
          DEFAULT: "#0e1117",
          soft: "#161b22",
          card: "#1a2029",
          elevated: "#21283180",
        },
        border: {
          DEFAULT: "#2a313c",
          soft: "#222831",
        },
        bull: {
          DEFAULT: "#26a69a",
          soft: "#26a69a33",
          strong: "#2ecc9b",
        },
        bear: {
          DEFAULT: "#ef5350",
          soft: "#ef535033",
          strong: "#ff6b6b",
        },
        accent: {
          DEFAULT: "#2962ff",
          soft: "#2962ff22",
          hover: "#1e53e0",
        },
        gold: "#f5b041",
        muted: "#8b949e",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "candle-grow": {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-12px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "candle-grow": "candle-grow 0.5s ease-out forwards",
        "slide-in": "slide-in 0.35s ease-out",
        "pulse-soft": "pulse-soft 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
