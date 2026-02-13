import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        accent: "#06B6D4",
        slateDeep: "#0F172A"
      },
      borderRadius: {
        xl2: "1rem"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.18)"
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(145deg, rgba(37,99,235,0.20), rgba(6,182,212,0.14))"
      }
    }
  },
  plugins: []
};

export default config;

