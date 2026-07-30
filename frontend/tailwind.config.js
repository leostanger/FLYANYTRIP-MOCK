/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e53935',
          dark: '#d32f2f',
          darker: '#c62828',
        },
        dark: {
          DEFAULT: '#1a1a2e',
          light: '#3a3a4a',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
