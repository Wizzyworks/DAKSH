/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        base: 'var(--base)',
        sec: 'var(--sec)',
        'sec-card': 'var(--sec-card)',
        acc: 'var(--acc)',
        'acc-hover': 'var(--acc-hover)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        line: 'var(--line)',
        'on-acc': 'var(--on-acc)',
        'sec-ink': 'var(--sec-ink)',
        'sec-ink-muted': 'var(--sec-ink-muted)',
        primary: 'var(--acc)',
        accent: 'var(--acc)',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
        display: ['Newsreader', 'Georgia', 'serif'],
      },
    },
  },
}
