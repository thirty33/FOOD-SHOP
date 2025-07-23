import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Polyfill for ProgressEvent which is not available in Node.js environment
interface ProgressEventInit extends EventInit {
  lengthComputable?: boolean;
  loaded?: number;
  total?: number;
}

// Ensure ProgressEvent is available before MSW initializes
if (typeof ProgressEvent === 'undefined') {
  class ProgressEventPolyfill extends Event {
    lengthComputable: boolean;
    loaded: number;
    total: number;

    constructor(type: string, eventInitDict?: ProgressEventInit) {
      super(type, eventInitDict);
      this.lengthComputable = eventInitDict?.lengthComputable ?? false;
      this.loaded = eventInitDict?.loaded ?? 0;
      this.total = eventInitDict?.total ?? 0;
    }
  }

  // Set it on multiple global objects for maximum compatibility
  (globalThis as any).ProgressEvent = ProgressEventPolyfill;
  (global as any).ProgressEvent = ProgressEventPolyfill;
  // Only set on window if it exists (to avoid window is not defined errors)
  if (typeof window !== 'undefined') {
    (window as any).ProgressEvent = ProgressEventPolyfill;
  }
}

// Global error handler to catch unhandled rejections during tests
const originalConsoleError = console.error;
let capturedErrors: any[] = [];

// Configurar MSW
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
  
  // Capture console errors during tests
  console.error = (...args) => {
    capturedErrors.push(args);
    // Still log the error for debugging
    originalConsoleError.apply(console, args);
  };
});

afterEach(() => {
  server.resetHandlers();
  // Clear captured errors after each test
  capturedErrors = [];
});

afterAll(() => {
  server.close();
  // Restore original console.error
  console.error = originalConsoleError;
});

// Add process error handlers
process.on('unhandledRejection', (reason, promise) => {
  // Only log if it's not a ProgressEvent related error from MSW
  if (!reason?.toString().includes('ProgressEvent is not defined')) {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  }
});

process.on('uncaughtException', (error) => {
  // Only log if it's not a ProgressEvent related error from MSW
  if (!error?.message?.includes('ProgressEvent is not defined')) {
    console.error('Uncaught Exception:', error);
  }
});