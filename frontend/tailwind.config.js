/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#818cf8',    // indigo-400
          DEFAULT: '#6366f1',  // indigo-500
          dark: '#4f46e5',     // indigo-600
        },
        secondary: {
          light: '#f0f9ff',    // light blue gray
          DEFAULT: '#e0f2fe',  // blue gray
          dark: '#0f172a',     // dark blue gray
        },
        accent: {
          blue: {
            light: '#60a5fa',  // blue-400
            DEFAULT: '#3b82f6', // blue-500
            dark: '#2563eb',   // blue-600
          }
        }
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to right bottom, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'custom': '0 0 15px 0 rgba(0, 0, 0, 0.1)',
        'custom-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}