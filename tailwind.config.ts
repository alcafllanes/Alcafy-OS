import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Solid colors — text / icons / borders only, never accent fills
        "alc-pink": "#F4C5D7",
        "alc-rose": "#E981A4", // primary accent
        "alc-coral": "#F9ADB7",
        "alc-peach": "#FEC9C3",
        "alc-cream": "#FAF2DD",
        ink: "#241B23", // near-black, warm-tinted body text
        muted: "#8A7B83",
      },
      backgroundImage: {
        // Gradient surfaces for cards/buttons/rings/charts — never flat fills
        "alc-gradient": "linear-gradient(135deg, #F4C5D7 0%, #E981A4 50%, #FEC9C3 100%)",
        "alc-gradient-soft": "linear-gradient(135deg, #FAF2DD 0%, #F9ADB7 60%, #F4C5D7 100%)",
        "alc-gradient-vivid": "linear-gradient(135deg, #E981A4 0%, #F9ADB7 45%, #FEC9C3 100%)",
      },
      borderRadius: {
        glass: "20px",
        "glass-lg": "24px",
        "glass-sm": "16px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(233, 129, 164, 0.12)",
        "glass-hover": "0 12px 40px 0 rgba(233, 129, 164, 0.18)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
