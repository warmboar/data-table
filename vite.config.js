import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/data-table/', 
  build: {
    outDir: 'docs',  
    emptyOutDir: true
  }
})