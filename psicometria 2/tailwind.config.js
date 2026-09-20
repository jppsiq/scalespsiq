/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Tema escuro controlado por classe no <html> (ver hooks/useTheme.ts).
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Paleta clínica: papel, tinta petróleo e um único acento.
        paper: '#FBFCFC',
        ink: '#15242B',
        petrol: { 50: '#EAF3F4', 100: '#CFE3E5', 300: '#7FB3B8', 500: '#1C7A83', 600: '#0F5C63', 700: '#0B474D', 900: '#0E1A1F' },
        line: '#D5DEE0',
      },
    },
  },
  plugins: [],
};
