/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    boxShadow: {
      component: "0 4px 6px -1px #883F1A",
      article: "0 4px 6px -1px #883F1A",
    },
    borderWidth: {
      DEFAULT: "0.1em",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
    },
    colors: {
      "background-component": "#c33b7a",
      "border-component": "#612f96",
      "border-inter-categories": "hsla(0, 0%, 100%, .1)",
      red: "#ff3333",
      green: "#5cb85c",
      "border-article": "#612f96",
      orange: "#EF7B45",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#d3dce6",
      slate: "#201f1f",
      "background-page": "#f3c238",
      white: "#FFFFFF",
    },
    extend: {
      backgroundImage: {
        logo_bg: "url('../public/logo.png')"
      },
    },
  },
  plugins: [],
};
