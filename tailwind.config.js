/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd", 
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        green: {
          50: "#A4C42B",
          100: "#286C39"
        },
        red: {
          1000: "#FF6A41"
        },
        yellow: {
          'active': '#FFC543'
        },
        gray: {
          'state': '#E6E6E6',
          'text-state': '#999999'
        }
      },
    },
    fontFamily: {
      body: [
        "CERA",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
      ],
      sans: [
        "CERA",
        "ui-sans-serif", 
        "system-ui",
        "sans-serif",
      ],
      "cera-light": ["CERA Light"],
      "cera-regular": ["CERA Regular"],
      "cera-medium": ["CERA Medium"],
      "cera-bold": ["CERA Bold"],
    },
  },
  plugins: [],
};