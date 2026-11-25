/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#494748',
        accent: '#927262',
        paper: '#fcfaf7',
        muted: '#eee7df',
        hero: '#E6D6C3',
        oat: '#E6D6C3',
        cocoa: '#927262',
        olive: '#AAB59B',
        denim: '#9EACC1',
        rosewood: '#BA8E91',
        charcoal: '#494748',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

