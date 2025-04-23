module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/leaflet/dist/leaflet.css",
  ],
  theme: {
    extend: {
      colors: {
        "bread-primary": "#f59e0b",
        "bread-secondary": "#fbbf24",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
