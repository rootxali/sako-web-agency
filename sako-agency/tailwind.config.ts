import type { Config } from "tailwindcss";

// Tailwind v4: Theme configuration is in app/globals.css via @theme directive.
// This file is kept for compatibility with tools that read tailwind.config.
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
