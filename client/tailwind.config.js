/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/**/*.{html,jsx}"],
  safelist: ["p-[0.6rem_1.6rem]", "p-[0.6rem_1.7rem]", "p-[0.6rem_2.3rem]"],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
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
      padding: {
        nav_small: "0.6rem 1.6rem",
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
        ".glavno-small": {
          fontFamily: '"Josefin Sans", sans-serif',
          fontWeight: "400",
          fontSize: "1.1rem",
        },
      });
    }),
  ],
};
