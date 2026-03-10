/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        newsprint: '#FAFAF7',
        ink: '#1A1A1A',
        gold: '#B5872A',
        darkbg: '#111111',
        darktext: '#F5F0E8',
      },
      fontFamily: {
        chewy: ['Chewy', 'system-ui', 'sans-serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'Source Serif 4, Georgia, serif',
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#1A1A1A',
            maxWidth: '680px',
          },
        },
      },
    },
  },
  plugins: [],
}
