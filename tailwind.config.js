/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    boxShadow: {
      component: "0 4px 6px -1px rgba(195, 152, 70, 0.99)",
      article: "0 4px 6px -1px rgba(157, 94, 109, 0.99)",
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
      "background-component": "#EFBE60",
      "border-component": "#a57c2e",
      "border-inter-categories": "hsla(0, 0%, 100%, .1)",
      red: "#ff3333",
      green: "#5cb85c",
      "border-article": "#e1899e",

      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#d3dce6",
      slate: "#201f1f",
      "background-page": "#EFDBD0",
      white: "#FFFFFF",
    },
    extend: {
      backgroundImage: {
        logo_bg: "url('../public/logo_pic_p24_blur.png')",
      },
    },
  },
  plugins: [],
};
