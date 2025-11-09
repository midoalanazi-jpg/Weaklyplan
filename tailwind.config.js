/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tajawal: ["Tajawal", "system-ui"],
      },
      colors: {
        primary: {
          light: "#e0f2fe",
          DEFAULT: "#38bdf8",
          dark: "#0284c7",
        },
        neutral: {
          light: "#f8fafc",
          DEFAULT: "#e2e8f0",
          dark: "#94a3b8",
        },
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
