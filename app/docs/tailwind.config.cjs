/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./docs/**/*.mdx", "./blog/**/*.mdx"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: ["class", '[data-theme="dark"]'],
};
