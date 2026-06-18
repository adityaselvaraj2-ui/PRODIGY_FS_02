/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        sans: ['Rajdhani', 'system-ui', 'sans-serif'],
      },
      colors: {
        abyss: {
          950: '#070A12',
          900: '#0B0F19',
          800: '#111827',
          700: '#161E2E',
          600: '#1F2A40',
        },
        arc: {
          300: '#BAE6FD',
          400: '#7DD3FC',
          500: '#38BDF8',
          600: '#0EA5E9',
          700: '#0284C7',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56,189,248,0.35), 0 0 24px -6px rgba(56,189,248,0.55)',
        'glow-lg': '0 0 0 1px rgba(56,189,248,0.45), 0 0 48px -8px rgba(56,189,248,0.75)',
      },
      backgroundImage: {
        'grid-arc':
          'linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px)',
        'radial-arc':
          'radial-gradient(circle at 20% 0%, rgba(14,165,233,0.18), transparent 50%), radial-gradient(circle at 80% 100%, rgba(56,189,248,0.12), transparent 55%)',
      },
      keyframes: {
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(56,189,248,0.45)' },
          '50%':    { boxShadow: '0 0 0 8px rgba(56,189,248,0)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        scan: 'scan 3s linear infinite',
      },
    },
  },
  plugins: [],
};
