/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Poppins", "sans-serif"]
      },
      height: {
        "full-nav": "calc(100dvh - 4rem)"
      },
      minHeight: {
        "full-nav": "calc(100dvh - 4rem)",
        "dscreen": "100dvh"
      }
    },
  },
  plugins: [],
}