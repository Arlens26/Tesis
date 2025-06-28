/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
],
  darkMode : 'class',
  theme: {
    extend: {
      screens: {
        'xs': {'max': '639px'}, 
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        'primary' : '#C20E1A',
        'main' : '#f2f2f2',
        'footer' : '#841F1C',
        'link' : '#cd1f32',
        'btn-create' : '#599876',
        'btn-edit' : '#3D5AA2',
        'text-primary': '#C20E1A',
      }
    },
  },
  plugins: [],
}

