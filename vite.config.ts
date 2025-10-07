/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0', // Escucha en todas las interfaces
    port: 5174 // O el puerto que prefieras
  },
  plugins: [
    react(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __DEV__: true,
  },
  resolve: {
    conditions: mode === 'test' ? ['development'] : [],
  },
}))
