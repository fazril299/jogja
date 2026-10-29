/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          50: '#FAF7F2',
          100: '#F4EEE5',
          200: '#E7DCB9',
          300: '#D5C497',
          400: '#C2A86B',
          500: '#A98942',
          600: '#8C6F32',
          700: '#6B5325',
          800: '#4D3B1B',
          900: '#2F2310',
        },
        nusantara: {
          crimson: '#9E2A2B',
          terracotta: '#C85A32',
          gold: '#D4AF37',
          bronze: '#8C5A2B',
          forest: '#1E3F20',
          ocean: '#114B5F',
          night: '#0D1117',
          charcoal: '#161B22',
        }
      },
      fontFamily: {
        outfit: ['"Outfit"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'batik-pattern': "radial-gradient(#D4AF37 0.75px, transparent 0.75px), radial-gradient(#D4AF37 0.75px, #0D1117 0.75px)",
      }
    },
  },
  plugins: [],
}
