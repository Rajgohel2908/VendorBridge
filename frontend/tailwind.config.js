/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#EEF3F8',
          surface: '#F7FAFD',
          panel: '#FFFFFF',
          sidebar: '#102033',
          primary: '#3157D5',
          primaryDark: '#243FA4',
          teal: '#0F8B8D',
          success: '#12805C',
          warning: '#B86B00',
          danger: '#C93B3B',
          muted: '#62718A',
          border: '#D7E0EA',
          ink: '#102033',
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
