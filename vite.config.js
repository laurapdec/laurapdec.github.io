import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',              // user site / custom domain
  build: { outDir: 'dist' },
  plugins: [react()],
})
