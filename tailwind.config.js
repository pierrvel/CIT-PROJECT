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
        // DESIGN.md Apple Minimal Design Tokens
        'apple': {
          'bg': '#FFFFFF',
          'bg-sec': '#F5F5F7',
          'surface': '#FFFFFF',
          'text': '#1D1D1F',
          'text-sec': '#6E6E73',
          'text-ter': '#86868B',
          'border': '#D2D2D7',
          'divider': '#E8E8ED',
          'accent': '#0071E3',
          'accent-hover': '#0077ED',
          'accent-subtle': '#EAF3FF',
          'success': '#248A3D',
          'warning': '#9A6700',
          'error': '#D70015',
          'dark-bg': '#000000',
          'dark-bg-sec': '#161617',
          'dark-surface': '#1C1C1E',
          'dark-text': '#F5F5F7',
          'dark-text-sec': '#A1A1A6',
          'dark-border': '#38383A',
          'dark-accent': '#2997FF',
        },
        // ClassSpace Paper Theme Tokens (Preserved)
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
        'apple-card': '14px',
        'apple-panel': '18px',
        'apple-btn': '10px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Pretendard Variable"',
          'Pretendard',
          '"Noto Sans KR"',
          'sans-serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          '"SF Mono"',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03)',
        'apple-md': '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'apple-dark': '0 4px 20px rgba(0, 0, 0, 0.45)',
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
