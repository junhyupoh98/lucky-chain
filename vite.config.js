import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        compact: false,
        generatorOpts: {
          compact: false
        }
      }
    })
  ],
  esbuild: {
    target: 'es2015'
  },
  build: {
    minify: 'esbuild'
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    }
  }
})