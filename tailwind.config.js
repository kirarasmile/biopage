/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ba-bg': '#f3f4f6',       // 浅灰背景
        'ba-primary': '#00a4db',  // 档案蓝 (Blue Archive Blue)
        'ba-accent': '#ff7e7e',   // 强调红/粉
        'ba-text': '#2d3748',     // 深灰文本
        'ba-panel': 'rgba(255, 255, 255, 0.90)', // 半透明面板
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}