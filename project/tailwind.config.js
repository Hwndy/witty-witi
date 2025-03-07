/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E6197D', // Magenta/pink from the flyer
        secondary: '#333333', // Dark gray from the flyer
        accent: '#FF6B00', // Orange from the flyer gradient
        light: '#F5F5F5',
        dark: '#1A1A1A',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/hero-bg.png')",
        'gradient-primary': 'linear-gradient(to right, #E6197D, #FF6B00)',
      },
    },
  },
  plugins: [],
};