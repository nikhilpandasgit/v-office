import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.json',
    '**/*.svg'
  ]
})
