const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      base: colors.black,
      "txt-base": colors.warmGray[300],
      primary: "#007ACC",
      "txt-primary": colors.white,
      secondary: colors.warmGray[700],
      "txt-secondary": colors.white,
      alert: colors.red[500],
      ligth: colors.warmGray[300],
      "txt-ligth": colors.warmGray[800],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
