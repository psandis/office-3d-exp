import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/office-3d-exp/',
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  server: {
    port: 3555,
  },
})
