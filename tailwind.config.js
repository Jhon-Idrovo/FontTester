const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      base: colors.black,
      "txt-base": colors.warmGray[300],
      primary: "#FF6542",
      "txt-primary": colors.white,
      secondary: colors.warmGray[700],
      "txt-secondary": colors.white,
      alert: colors.red[700],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
