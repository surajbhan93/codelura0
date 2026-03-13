import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import flowbite from "flowbite/plugin";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/flowbite-react/**/*.js"
  ],

  theme: {
    extend: {},
  },

  plugins: [
    typography,   // ✅ no require
    flowbite      // ✅ no require
  ],
};

export default config;