import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-core': ['react', 'react-dom', 'react-router-dom', 'axios'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
