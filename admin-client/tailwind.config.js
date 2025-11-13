/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-green': '#059669', // আপনার সবুজ থিম
        'theme-yellow': '#facc15', // আপনার হলুদ থিম
        'theme-bg': '#fcf8f0', // আপনার ক্রিম ব্যাকগ্রাউন্ড
      }
    },
  },
  plugins: [],
}