/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        'primary-dark': '#388E3C',
        'bg-light': '#F0FDF4',
        'text-dark': '#1F2937',
      },
    },
  },
  plugins: [],
}
