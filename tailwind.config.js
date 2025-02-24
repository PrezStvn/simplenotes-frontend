/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'editor': {
          'bg': '#1E1E1E',        // VSCode-like background
          'sidebar': '#252526',    // Slightly lighter for sidebar
          'active': '#2D2D2D',    // Active tab/item background
          'border': '#404040',    // Subtle borders
          'text': '#D4D4D4',      // Primary text color
          'accent': '#0F9D58',    // Primary accent color
          'hover': '#2C2C2C',     // Hover state color
        }
      }
    },
  },
  plugins: [],
} 