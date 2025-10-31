/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundOpacity: {
        '15': '0.15',
      }
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  }
}