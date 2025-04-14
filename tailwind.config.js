/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#a1cd2a', // Light green
          50: '#f8fbed',
          100: '#f0f8d7',
          200: '#e3f1b0',
          300: '#d1e880',
          400: '#bddc57',
          500: '#a1cd2a', // Primary green
          600: '#85a821',
          700: '#67831d',
          800: '#52681c',
          900: '#45581b',
          950: '#243009'
        },
        secondary: {
          DEFAULT: '#2e7d32', // Dark green
          50: '#f3faf3',
          100: '#e3f3e4',
          200: '#c7e6c9',
          300: '#9cd29f',
          400: '#6ab56e',
          500: '#4a9a4e',
          600: '#2e7d32', // Secondary dark green
          700: '#276529',
          800: '#235123',
          900: '#1e441f',
          950: '#0c2a0f'
        }
      },
      boxShadow: {
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner-xl': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'elevation-1': '0 2px 4px -1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.1)',
        'elevation-2': '0 4px 6px -2px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.1)',
        'elevation-3': '0 10px 15px -3px rgba(0,0,0,0.08), 0 20px 25px -5px rgba(0,0,0,0.12)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
}