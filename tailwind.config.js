/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        regulatory: {
          50:  '#EAF2FF',
          100: '#D7E6FF',
          200: '#B0CDFF',
          300: '#86B2FF',
          400: '#5E96FF',
          500: '#2F74FF',
          600: '#1E58CC',
          700: '#15429C',
          800: '#0F2D6B',
          900: '#0B224F',
          950: '#071737'
        },
        danger: {
          50:  '#FFEAEA',
          100: '#FFD7D7',
          200: '#FFB0B0',
          300: '#FF8686',
          400: '#FF5E5E',
          500: '#FF2F2F',
          600: '#CC1E1E',
          700: '#9C1515',
          800: '#6B0F0F',
          900: '#4F0B0B',
          950: '#370707'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.35)',
        'glow-blue': '0 0 0 1px rgba(47,116,255,0.25), 0 12px 40px rgba(47,116,255,0.18)',
        'glow-red': '0 0 0 1px rgba(255,47,47,0.25), 0 12px 40px rgba(255,47,47,0.18)'
      },
      backgroundImage: {
        hero:
          'radial-gradient(900px circle at 15% 10%, rgba(47,116,255,0.18), transparent 45%), radial-gradient(750px circle at 85% 15%, rgba(255,47,47,0.12), transparent 48%)'
      }
    }
  },
  plugins: []
}
