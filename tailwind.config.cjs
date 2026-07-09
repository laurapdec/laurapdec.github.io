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
      },
      colors: {
        ink: {
          DEFAULT: '#292524',
          light: '#3a3532',
          dark: '#201d1c',
        },
        cream: {
          DEFAULT: '#f2ece0',
          dark: '#e8ddc8',
        },
        accent: {
          DEFAULT: '#1a2e05',
          light: '#3f5e1a',
        },
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  }
}