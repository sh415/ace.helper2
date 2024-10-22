/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/**/*.{vue,js,ts,jsx,tsx}',
      './src/renderer/index.html', // Electron 메인 HTML 파일
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }