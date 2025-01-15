/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'border-red-400',
    'border-yellow-400',
    'border-green-400',
    'border-blue-400',
    'hover:bg-red-400',
    'hover:bg-yellow-400',
    'hover:bg-green-400',
    'hover:bg-blue-400',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

