/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1a1a1a',
          light: '#f9f9f9',
          accent: '#0070f3'
        }
      }
    },
  },
  plugins: [],
}
