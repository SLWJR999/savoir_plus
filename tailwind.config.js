/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#B3202A', dark: '#8E1822', soft: '#F8E7E4' },
        gold: { DEFAULT: '#B98F3F', soft: '#F3E8C9', dark: '#7A5A1C' },
        paper: '#F5EFE4', sand: '#E6DCC8', ink: '#2A2827', stone: '#6B6764',
        maths: '#B3202A', pc: '#B98F3F', svt: '#6B6764',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
