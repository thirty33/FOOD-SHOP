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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'notistack-vendor': ['notistack'],
        }
      }
    }
  },
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
