/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f4e8',
          100: '#e1e9d2',
          200: '#c3d3a5',
          300: '#a5bd78',
          400: '#87a74b',
          500: '#537A2B',
          600: '#496c26',
          700: '#3f5d21',
          800: '#344f1b',
          900: '#2a4016',
          950: '#1f3010',
        },
      },
    },
  },
  plugins: [],
};