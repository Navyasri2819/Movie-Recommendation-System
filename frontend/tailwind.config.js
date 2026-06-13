/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        netflix: '#e50914',
        coal: '#050505',
        smoke: '#b3b3b3'
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body: ['Montserrat', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        poster: '0 24px 60px rgba(0, 0, 0, 0.55)'
      }
    }
  },
  plugins: []
};

