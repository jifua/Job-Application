/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#10192B",
          soft: "#3A4557",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F4F6F8",
          border: "#DCE1E8",
        },
        blueprint: {
          50: "#EEF3FB",
          100: "#D6E2F5",
          400: "#3E71B8",
          500: "#1E4B8F",
          600: "#163A70",
          700: "#102A52",
        },
        signal: {
          DEFAULT: "#F2A93B",
          soft: "#FBE6C1",
        },
        match: {
          DEFAULT: "#1D7A5F",
          soft: "#DCF1E9",
        },
        warn: {
          DEFAULT: "#C24A3B",
          soft: "#F7DFDB",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 25, 43, 0.06), 0 1px 0 rgba(16, 25, 43, 0.04)",
      },
    },
  },
  plugins: [],
}

