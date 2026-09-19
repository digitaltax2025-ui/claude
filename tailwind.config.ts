import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          500: "#1d6fd6",
          600: "#155bb5",
          700: "#0f478d",
          900: "#0a2e5c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
