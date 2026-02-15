/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      // Custom colors
      colors: {
        // Primary brand colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Dark theme colors
        gray: {
          750: '#2d3748',
          850: '#1a202c',
          950: '#0f172a',
        },
      },
      // Blur effects
      blur: {
        '3xl': '64px',
        '4xl': '80px',
      },
      // Background images
      backgroundImage: {
        'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      // Box shadows
      boxShadow: {
        'xs': '0 0 0 1px rgba(0, 0, 0, 0.05)',
        'outline': '0 0 0 3px rgba(59, 130, 246, 0.5)',
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
      },
      // Animation
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  // Variants
  variants: {
    extend: {
      backgroundColor: ['active', 'group-hover'],
      textColor: ['active', 'group-hover'],
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  // Plugins
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // Only generate classes instead of base styles
    }),
    require('@tailwindcss/typography')({
      className: 'prose',
    }),
  ],
};