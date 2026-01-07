module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sage': {
          50: '#f8faf8',
          100: '#f0f4f0',
          200: '#d4e3d4',
          300: '#b8d1b8',
          400: '#7aad7a',
          500: '#4a8a4a',
          600: '#3d6f3d',
          700: '#305630',
          800: '#243c24',
          900: '#1a2b1a',
        },
        'cream': {
          50: '#fffbf5',
          100: '#fef8f0',
          200: '#fce8d4',
          300: '#f9d9b8',
          400: '#f4ba80',
          500: '#e8a048',
          600: '#d68a3a',
          700: '#b8702e',
          800: '#8f5824',
          900: '#6b401a',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'cursive'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
