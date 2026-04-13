import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // TODO: change to 'http://leandrovivares.com' before merging to staging
        changeOrigin: true,
      }
    }
  }
})
