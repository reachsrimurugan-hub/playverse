/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yt: {
          bg: '#0f0f0f',
          light: '#272727',
          hover: '#3f3f3f',
          text: '#f1f1f1',
          textMuted: '#aaaaaa'
        }
      }
    },
  },
  plugins: [],
}
