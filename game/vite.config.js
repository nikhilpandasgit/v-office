import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.json',
    '**/*.svg'
  ]
})
