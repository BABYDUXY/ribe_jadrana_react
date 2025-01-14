/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/**/*.{html,jsx}"],
  theme: {
    extend: {
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
  plugins: [],
};
