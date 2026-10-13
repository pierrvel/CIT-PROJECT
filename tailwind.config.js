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
        'cs-bg': '#f4f8f0',
        'cs-paper': '#fbfcf8',
        'cs-paper-2': '#f7faf4',
        'cs-line': '#e1e9df',
        'cs-line-strong': '#d6e2d4',
        'cs-ink': '#1f2c24',
        'cs-muted': '#7d8a80',
        'cs-green': '#8fb99a',
        'cs-green-soft': '#dfeedd',
        'cs-green-softer': '#edf5e9',
        'cs-green-deep': '#45624d',
        'cs-cream': '#f7f2df',
        'cs-danger': '#a5483c',
        'cs-warn': '#7a6233',
        'cs-action': '#739c7e',
      },
      borderRadius: {
        'cs': '22px',
        'cs-sm': '14px',
        'cs-lg': '28px',
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', '"Helvetica Neue"', '"Segoe UI"', '"Apple SD Gothic Neo"', '"Noto Sans KR"', '"Malgun Gothic"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.5)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.5)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.5)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.6)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.5)'
      }
    },
  },
  plugins: [],
}
