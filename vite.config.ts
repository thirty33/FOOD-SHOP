/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Escucha en todas las interfaces
    port: 5174 // O el puerto que prefieras
  },
  plugins: [
    react(),
  ]
})
