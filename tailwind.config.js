/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080808',
        bone: '#F4F4F0',
        lime: '#D7FF3F',
        ash: {
          100: '#1A1A1A',
          200: '#222222',
          300: '#2E2E2E',
          400: '#3A3A3A',
          500: '#565656',
          600: '#7A7A7A',
          700: '#9A9A9A',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['"Neue Montreal"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        mega: ['clamp(3.5rem, 14vw, 22rem)', { lineHeight: '0.82', letterSpacing: '-0.04em' }],
        display: ['clamp(2.5rem, 8vw, 9rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        lead: ['clamp(1.25rem, 2.2vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
