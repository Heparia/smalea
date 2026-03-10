// tailwind.config.js
import flowbite from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#117e55",
        secondary: "#41b3af",
        accent: "#49a9c7",
        danger: "#ee1c1d",
        darkblue: "#304557",
        light: "#f8f9f9"
      }
    }
  },
  plugins: [flowbite]
};

export default config;