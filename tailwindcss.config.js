module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bread-primary': '#f59e0b',
        'bread-secondary': '#fbbf24',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}