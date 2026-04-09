import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  base: command === 'build' ? '/office-3d-exp/' : '/',
  server: {
    port: 4444,
  },
}))
