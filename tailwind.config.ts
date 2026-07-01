import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#030303',
        surface: '#0a0a0a',
        border: {
          DEFAULT: '#1a1a1a',
          hover: '#333333',
        },
        text: {
          primary: '#f4f4f4',
          secondary: '#888888',
          tertiary: '#555555',
        },
        gold: {
          start: '#bf953f',
          mid: '#fcf6ba',
          end: '#b38728',
        },
        card: {
          lower: '#b08d57',
          upper: '#00e5ff',
          recovery: '#d4af37',
          rest: '#71797e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s infinite alternate',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'screen-glitch': 'screenGlitch 0.15s ease-in-out 3',
        'terminal-blink': 'terminalBlink 1s step-end infinite',
        'xp-pop': 'xpPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        pulseGlow: {
          '0%': { textShadow: '0px 0px 15px rgba(252, 246, 186, 0.1)' },
          '100%': { textShadow: '0px 0px 35px rgba(252, 246, 186, 0.4)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        screenGlitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
        },
        terminalBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        xpPop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
