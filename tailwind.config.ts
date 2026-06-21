import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#17130f",
        gold: "#C8962A",
        rust: "#B84C1E",
        beige: "#E8D5B5",
        cream: "#F5ECD7",
        surface: "#3D2B1F",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        tactical: ["var(--font-big-shoulders)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0px",
        none: "0px",
      },
    },
  },
  plugins: [],
};
export default config;
