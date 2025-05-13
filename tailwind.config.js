module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Inclou els fitxers de React
    './index.html',  // Inclou el fitxer HTML de Vite
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}