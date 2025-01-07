import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/setupTests.ts'],
        coverage: {
            exclude: [
                '**/*.config.ts',
                '**/*.config.js',
                '**/*.types.ts',
                '**/*.d.ts',
                '**/types',
                '**/App.tsx',
                '**/main.tsx'
            ],
            thresholds: {
                // functions: 80
            }
        }
    }
})