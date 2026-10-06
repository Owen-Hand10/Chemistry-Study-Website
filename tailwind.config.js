/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { ink: '#202c2b', mint: '#b9f5df', coral: '#fb765d' }, fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Manrope', 'sans-serif'], mono: ['DM Mono', 'monospace'] } } },
  plugins: [],
}