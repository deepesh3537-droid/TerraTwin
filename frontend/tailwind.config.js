/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#070a10',
          900: '#0b0f19',
          850: '#0f172a',
          800: '#111827',
          700: '#1e293b',
          600: '#334155',
          border: '#1e293b',
          'border-light': '#334155',
        },
        planet: {
          earth: '#38bdf8',
          moon: '#cbd5e1',
          mars: '#f97316',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#f43f5e',
          info: '#38bdf8',
          unimplemented: '#a855f7',
          unconfigured: '#ea580c',
          demo: '#eab308',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
