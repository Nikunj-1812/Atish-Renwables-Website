/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7fbf8',
          100: '#e6f4eb',
          500: '#1f7a4d',
          600: '#17603d',
          700: '#114a30',
        },
      },
      boxShadow: {
        card: '0 14px 35px -24px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
};
