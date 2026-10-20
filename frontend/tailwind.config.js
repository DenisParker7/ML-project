/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkgrey: {
          50: '#F9F9F9',
          100: '#F0F0F0',
          200: '#E5E5E5',
          300: '#CCCCCC',
          400: '#999999',
          500: '#666666',
          600: '#4D4D4D',
          700: '#3D3D3D',
          800: '#323232', // User Dark Grey
          850: '#282828',
          900: '#1F1F1F',
          950: '#141414',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'clean': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'luxury': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 4px 10px -4px rgba(0, 0, 0, 0.03)',
        'pill': '0 2px 8px rgba(50, 50, 50, 0.12)',
      }
    },
  },
  plugins: [],
}
