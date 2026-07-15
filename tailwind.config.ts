import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem", xl: "2.5rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#17130F",
          soft: "#2A241D",
          muted: "#4A4237",
        },
        paper: "#FBF9F5",
        cream: "#F6F1E9",
        sand: "#F1EBE0",
        stone: {
          50: "#F7F5F1",
          100: "#EEEAE2",
          200: "#DDD6C9",
          300: "#C6BCAA",
          400: "#AA9E88",
          500: "#8C8069",
          600: "#6F6553",
          700: "#564E40",
          800: "#3B342A",
          900: "#221E18",
        },
        brass: {
          50: "#FAF5EA",
          100: "#F1E6CD",
          200: "#E4CDA0",
          300: "#D4B071",
          400: "#C39A50",
          500: "#B0863F",
          600: "#956C32",
          700: "#77552A",
          800: "#5D4324",
          900: "#4C371F",
        },
        success: "#3F7D5A",
        danger: "#B4453A",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "Cambria", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.22em",
        wider2: "0.14em",
      },
      boxShadow: {
        soft: "0 2px 20px -8px rgba(23,19,15,0.12)",
        card: "0 10px 44px -16px rgba(23,19,15,0.18)",
        lift: "0 26px 60px -20px rgba(23,19,15,0.26)",
        ring: "0 0 0 1px rgba(23,19,15,0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        kenburns: {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.16)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.7s ease both",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-right": "slideInRight 0.45s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 1.6s linear infinite",
        kenburns: "kenburns 14s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
