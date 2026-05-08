/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF2F7',
          100: '#D1DCE8',
          500: '#3B6FA0',
          700: '#1A3C5E',
          900: '#0D1F30',
        },
        teal: {
          400: '#45B5A8',
          500: '#2E8B7A',
          600: '#1E6B5D',
        },
        cream: '#F7F5F0',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
