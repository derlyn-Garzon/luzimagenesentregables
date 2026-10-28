/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#e5d0cb',
          300: '#d0ad00',
          400: '#e07a5f',
          500: '#d9534f',
          600: '#c0392b',
          700: '#902c23',
          800: '#641e16',
          900: '#3d120d',
        },
        warm: {
          50: '#fefcfb',
          100: '#fdf6f0',
          200: '#fbeade',
          300: '#f7d2be',
          400: '#f1ad8e',
          500: '#e7825d',
          600: '#d15e3b',
          700: '#ad4326',
          800: '#893622',
          900: '#6f2d1e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif']
      }
    },
  },
  plugins: [],
}
