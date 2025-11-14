/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // আপনার অ্যাডমিন প্যানেল ও ছবি অনুযায়ী কালার থিম
        "theme-green": "#059669", // মূল সবুজ
        "theme-yellow": "#facc15", // মূল হলুদ
        "theme-bg": "#fcf8f0", // আপনার ক্রিম/অফ-হোয়াইট ব্যাকগ্রাউন্ড
      },
    },
  },
  plugins: [],
};