import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './content/**/*.{md,mdx,json}',
  ],
  theme: {
    extend: {
      colors: {
        // NHM London-inspired palette: deep aubergine primary with
        // peach / lime / cyan accents. Bold, modern museum branding.
        brand: {
          ink: '#1a0820',
          deep: '#290340',
          midnight: '#16021f',
          purple: '#523364',
          accent: '#523364',
          peach: '#f2bab0',
          lime: '#c9f708',
          cyan: '#0dedf7',
          warm: '#f2bab0',
          warmDeep: '#c4877b',
          paper: '#fbf6f0',
          bone: '#f0e6d6',
          line: '#e3d8c8',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'Georgia', 'serif'],
      },
      maxWidth: {
        prose: '70ch',
      },
      letterSpacing: {
        widerx: '0.16em',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1) translate(0,0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        kenburns: 'kenburns 18s ease-out forwards',
        fadeUp: 'fadeUp 0.8s ease-out forwards',
        slideInRight: 'slideInRight 0.22s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
