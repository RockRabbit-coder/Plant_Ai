/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        leaf: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        glass: {
          surface: 'rgba(15, 23, 42, 0.65)',
          surfaceHover: 'rgba(30, 41, 59, 0.75)',
          border: 'rgba(255, 255, 255, 0.1)',
          borderHover: 'rgba(52, 211, 153, 0.4)',
          glow: 'rgba(16, 185, 129, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glass-glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
