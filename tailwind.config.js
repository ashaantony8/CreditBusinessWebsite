/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "color-primary": "#CDD6E9",
        "color-primary-light": "#FAF9FE",
        "color-primary-dark": "#081B2C",
        "color-text-primary": "#02002E",
        "color-text-secondary": "#1B4398",
        "color-text-dark": "#828282",
        "color-text-secondary-dark": "#929292",
        "color-text-primary-dark": "#b6bbc0",
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, white 75%, #1A439A 75%)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        Playfair: ["Raleway", "sans-serif"],
      },
      boxShadow: {
        shadowCustom: ["inset] 0 0 8px 8px white"],
      },
    },
  },

  plugins: [],
};
