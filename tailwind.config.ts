import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'pulse-border': 'pulse-border 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { borderColor: '#7DD3FC' , boxShadow: '0 0 0 1px #7DD3FC' }, // This is the Tailwind CSS color 'blue-500'
          '50%': { borderColor: '#0284C7' , boxShadow: '0 0 5px 1px #0284C7' }, // This is the Tailwind CSS color 'blue-600'
        },
      },
    },
  },
  plugins: [],
};

export default config;
