/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/**/*.{html,jsx}"],
  theme: {
    extend: {
      colors: {
        moja_plava: {
          DEFAULT: "#6993CD",
          tamna: "#5884BE",
        },
      },
      fontFamily: {
        glavno: "Josefin Sans, sans-serif",
      },
      keyframes: {
        spawn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
      animation: {
        spawn: "spawn 300ms ease-in 200ms forwards",
      },
    },
  },
  plugins: [
    require("tailwindcss/plugin")(function ({ addComponents }) {
      addComponents({
        ".glavno-naslov": {
          fontFamily: '"Josefin Sans", sans-serif',
          fontWeight: "700",
          fontSize: "1.7rem",
        },
        ".glavno-nav": {
          fontFamily: '"Josefin Sans", sans-serif',
          fontWeight: "500",
          fontSize: "1.2rem",
        },
      });
    }),
  ],
};
