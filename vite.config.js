import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // Set base path to root
  build: { 
    outDir: 'dist',
    sourcemap: false, // Disable source maps
  },
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Ensure .jsx, .ts, and .tsx files are resolved
  },
})
