/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1611',
          deep: '#0d0b08',
          light: '#2a241c',
        },
        parchment: {
          DEFAULT: '#f5f0e8',
          light: '#faf7f2',
          dim: '#c8bfb2',
        },
        dust: {
          DEFAULT: '#8c8070',
          light: '#b5a898',
          dark: '#5c5448',
        },
        amber: {
          DEFAULT: '#c8962a',
          warm: '#d4a843',
          pale: '#e8c97a',
        },
        crimson: '#8b2635',
        sage: '#4a6741',
      },
      fontFamily: {
        literary: ['"Noto Serif SC"', 'STSong', 'SimSun', 'serif'],
        ui: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'gentleFloat 4s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'text-reveal': 'textReveal 0.5s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        textReveal: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        literary: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '104': '26rem',
        '112': '28rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
}
