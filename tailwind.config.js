/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fall: {
          '0%': { top: '-40px', opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
      },
      animation: {
        fall: 'fall linear',
      },
    },
  },
  plugins: [],
};
