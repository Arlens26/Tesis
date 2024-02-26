/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
],
  darkMode : 'class',
  theme: {
    extend: {
      colors: {
        'primary' : '#C20E1A',
        'main' : '#CFCFCF',
        'footer' : '#841F1C',
        'link' : '#cd1f32',
        'btn-create' : '#599876',
        'btn-edit' : '#3D5AA2',
      }
    },
  },
  plugins: [],
}

