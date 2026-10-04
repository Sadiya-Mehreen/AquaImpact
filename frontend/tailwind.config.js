/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aqua: {
          50: "#f0fbfc",
          100: "#dbf3f6",
          200: "#b8e8ee",
          300: "#87d7e1",
          400: "#4dbdcc",
          500: "#1fa0b3",
          600: "#0e7c8c",
          700: "#0d6272",
          800: "#0f4f5c",
          900: "#0b2e33",
        },
        leaf: {
          400: "#6fbf9b",
          500: "#3fa77f",
          600: "#2f8a68",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        aqua: "0 8px 30px -8px rgba(14, 124, 140, 0.25)",
        "aqua-lg": "0 20px 50px -12px rgba(14, 124, 140, 0.3)",
      },
      backgroundImage: {
        "aqua-gradient": "linear-gradient(135deg, #14a3b8 0%, #2e86c1 100%)",
        "aqua-soft": "linear-gradient(180deg, #f0fbfc 0%, #ffffff 100%)",
      },
      keyframes: {
        "wave-drift": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float-up": {
          "0%": { transform: "translateY(0) scale(0.9)", opacity: "0" },
          "15%": { transform: "translateY(-4px) scale(1.08)", opacity: "1" },
          "75%": { transform: "translateY(-34px) scale(1.02)", opacity: "1" },
          "100%": { transform: "translateY(-54px) scale(1)", opacity: "0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.45" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        "bob": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "logo-float": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2.5px)" },
        },
        "logo-pulse": {
          "0%": { transform: "scale(0.85)", opacity: "0.45" },
          "70%,100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "ripple-expand": {
          "0%": { transform: "scale(0.7)", opacity: "0.55" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "idle-sway": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        "shimmer": {
          "0%,100%": { opacity: "0.12" },
          "50%": { opacity: "0.32" },
        },
      },
      animation: {
        "wave-drift-slow": "wave-drift 18s linear infinite",
        "wave-drift-slower": "wave-drift 28s linear infinite",
        "float-up": "float-up 1.6s ease-out forwards",
        ripple: "ripple 0.7s ease-out forwards",
        bob: "bob 4s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-right": "fade-right 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "logo-float": "logo-float 5s ease-in-out infinite",
        "logo-pulse": "logo-pulse 3.2s ease-out infinite",
        "ripple-expand": "ripple-expand 4.5s ease-out infinite",
        "idle-sway": "idle-sway 6s ease-in-out infinite",
        shimmer: "shimmer 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
