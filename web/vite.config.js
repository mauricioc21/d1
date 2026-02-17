import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const resolvePath = (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolvePath('./src'),
      '@shared': resolvePath('../shared'),
      '@shared/utils': resolvePath('../shared/utils'),
    },
  },
})
