import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'unluminiferous-katelynn-mulishly.ngrok-free.dev'
    ]
  },
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.json',
    '**/*.svg'
  ]
})
