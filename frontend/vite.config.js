import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Dev proxy to avoid CORS when calling the iTunes Search API locally
  // Requests to /api/itunes?term=... will be proxied to https://itunes.apple.com/search?term=...
  server: {
    port: 3000,
    proxy: {
      '/api/itunes': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/itunes/, '/search')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          games: [
            './src/components/games/Snake.jsx',
            './src/components/games/TicTacToe.jsx',
            './src/components/games/Memory.jsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
