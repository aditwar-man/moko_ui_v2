/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fall: {
          '0%': {
            top: '-10%',
            transform: 'translateY(0) rotate(0deg)',
            opacity: '1', // <- pastikan tetap 1
          },
          '100%': {
            top: '100%',
            transform: 'translateY(200px) rotate(180deg)',
            opacity: '1', // <- tetap solid
          },
        },
      },
      animation: {
        fall: 'fall linear infinite',
      },
    },
  },
  plugins: [],
};
