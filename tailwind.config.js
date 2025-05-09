/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EBF4',
          100: '#C2D1E5',
          200: '#9BB4D6',
          300: '#7496C6',
          400: '#4F78B7',
          500: '#3B5998',
          600: '#31487A',
          700: '#1A365D',
          800: '#12243E',
          900: '#09121F',
        },
        accent: {
          50: '#F9F5F0',
          100: '#F0E6D9',
          200: '#E6D2B3',
          300: '#D9BF8D',
          400: '#D2AD68',
          500: '#C69C6D',
          600: '#A47E4E',
          700: '#805F3A',
          800: '#5F4527',
          900: '#3F2E1A',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};