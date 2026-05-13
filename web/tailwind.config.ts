import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  /* Reads data-theme="light" | "dark" from <html> */
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        /* All colors reference CSS custom properties so they react to theme changes */
        base:     'var(--bg-base)',
        surface:  'var(--bg-surface)',
        surface2: 'var(--bg-surface-2)',
        'tx-1':   'var(--text-1)',
        'tx-2':   'var(--text-2)',
        'tx-3':   'var(--text-3)',
        border:   'var(--border)',
        'border-mid': 'var(--border-mid)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
        syne: ["'Syne'", 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg,#4f46e5,#06b6d4)',
        'gradient-logo':    'linear-gradient(90deg,#7dd3fc,#c084fc)',
        'gradient-warm':    'linear-gradient(90deg,#fb923c,#f472b6)',
        'gradient-green':   'linear-gradient(90deg,#34d399,#10b981)',
        'gradient-headline':'linear-gradient(90deg,#818cf8,#06b6d4)',
      },
      borderRadius: {
        '2': '2px', '3': '3px',
      },
    },
  },
  plugins: [],
}

export default config
