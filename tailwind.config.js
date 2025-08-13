/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        baloo: ['"Baloo 2"', "cursive"],
      },
      keyframes: {
        fall: {
          '0%': {
            top: '-10%',
            transform: 'translateY(0) rotate(0deg)',
            opacity: '1',
          },
          '100%': {
            top: '100%',
            transform: 'translateY(200px) rotate(180deg)',
            opacity: '1',
          },
        },
        'bounce-up-fade': {
          '0%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-60px)',
            opacity: '0',
          },
        },
        'wind-line': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        spiralSmoke: {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'translateY(-80px) scale(1.2)',
            opacity: '0',
          },
        },
      },
      animation: {
        fall: 'fall linear infinite',
        'bounce-up-fade': 'bounce-up-fade 1.5s ease-out forwards', // 👈 Tambahan
        'wind-line': 'wind-line linear infinite',
        spiralSmoke: 'spiralSmoke 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
