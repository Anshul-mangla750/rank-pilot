/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Deep Modern Slate Navy (Stripe / Linear / Vercel style)
        primary: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
        },
        // Accent: Precision High-Tech Blue
        accent: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Surfaces
        surface: {
          bg:     '#F8FAFC',  // Crisp slate-50
          card:   '#FFFFFF',
          border: '#E2E8F0',  // Crisp structural border slate-200
        },
        // Text
        ink: {
          DEFAULT: '#0F172A', // Slate 900
          muted:   '#64748B', // Slate 500
          faint:   '#94A3B8', // Slate 400
        },
        // Status
        status: {
          pass:    '#059669', // Emerald 600
          warning: '#D97706', // Amber 600
          fail:    '#DC2626', // Red 600
          info:    '#2563EB', // Blue 600
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs':   ['12px', { lineHeight: '16px' }],
        'sm':   ['13px', { lineHeight: '20px' }],
        'base': ['14px', { lineHeight: '22px' }],
        'lg':   ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'xl':   ['18px', { lineHeight: '26px', fontWeight: '600' }],
        '2xl':  ['24px', { lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.02em' }],
        '3xl':  ['30px', { lineHeight: '38px', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
      spacing: {
        'sidebar': '240px',
      },
      boxShadow: {
        'xs':       '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card':     '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'modal':    '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      maxWidth: {
        'form': '400px',
        'content': '1240px',
      },
    },
  },
  plugins: [],
}
