/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#F8FAFC',
          sidebar: '#0F172A',
          primary: '#2563EB',
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
