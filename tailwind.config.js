/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkblue: '#123458',
        darkbeige: '#D4C9BE',
        mediumbeige: '#F1EFEC',
        lightbeige: 'rgba(241, 239, 236, 0.5)',
        customgray: '#ADADAD',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}