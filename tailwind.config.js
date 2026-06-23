/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand — fresh, appetizing green
        brand: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
          500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d',
        },
        // Ink — green-tinted neutrals (cohesion with brand)
        ink: {
          50: '#f1f4f2', 100: '#e7ebe8', 200: '#d6ddd9', 300: '#c0c9c4',
          400: '#9aa4a0', 500: '#6b7470', 600: '#525c58', 700: '#384441',
          800: '#222c29', 900: '#111c18',
        },
        canvas: '#f3f7f4',
        surface: { DEFAULT: '#ffffff', sunken: '#f7faf8' },
        line: { DEFAULT: '#e9efeb', strong: '#dde5e0' },
        // Semantic
        success: { DEFAULT: '#16a34a', bg: '#dcfce7' },
        warning: { DEFAULT: '#f59e0b', bg: '#fef3c7' },
        danger: { DEFAULT: '#ef4444', bg: '#fee2e2', text: '#dc2626' },
        // Macro data-viz
        protein: '#3b82f6',
        carbs: '#f59e0b',
        fat: '#f43f5e',
      },
      borderRadius: {
        xl: '1rem', '2xl': '1.25rem', '3xl': '1.75rem', '4xl': '2.25rem',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(16,24,40,.04)',
        card: '0 4px 16px rgba(16,24,40,.05)',
        pop: '0 12px 32px rgba(16,24,40,.12)',
        brand: '0 10px 22px rgba(22,163,74,.22)',
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
