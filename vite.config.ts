import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // TODO: 部署到 GitHub Pages 时，将 '/' 改为 '/你的仓库名/'
  base: '/biopage/', 
})