/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: {
          DEFAULT: '#ffffff',
          light: '#f1f5f9',
          card: '#ffffff',
          border: '#e2e8f0',
        },
        indigo: {
          deep: '#f8fafc',
          midnight: '#f1f5f9',
        },
        azure: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0078d4', // Official Microsoft Azure Blue
          600: '#0067b8',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Mapped to Azure Blue for seamless backwards compatibility with existing UI tokens
        sunset: {
          DEFAULT: '#0078d4',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#2563eb',
          500: '#0078d4',
          600: '#0067b8',
          700: '#1d4ed8',
        },
        savannah: {
          DEFAULT: '#059669',
          50: '#ecfdf5',
          100: '#d1fae5',
          400: '#10b981',
          500: '#059669',
          600: '#047857',
          700: '#065f46',
        },
        dusk: {
          DEFAULT: '#4f46e5',
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#6366f1',
          500: '#4f46e5',
          600: '#4338ca',
        },
        glass: {
          bg: 'var(--glass-bg)',
          'bg-strong': 'var(--glass-bg-strong)',
          border: 'var(--glass-border)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 4px 14px 0 rgba(0, 120, 212, 0.25)',
        'glow-blue': '0 4px 14px 0 rgba(0, 120, 212, 0.25)',
        'glow-green': '0 4px 14px 0 rgba(16, 185, 129, 0.2)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'glass': 'var(--glass-shadow)',
      }
    },
  },
  plugins: [],
}
