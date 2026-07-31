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
          red: '#E61E2A',
          black: '#000000',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        inter: ['Plus Jakarta Sans', 'sans-serif'],
        fun: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        premium: '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.02)',
      }
    },
  },
  plugins: [],
}
