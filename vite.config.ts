import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // static hosting anywhere; routing is hash-based
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts', 'spikes/**/*.test.{ts,tsx}'],
    environment: 'node',
    // Forks workers intermittently time out starting on this Windows machine (seen twice); threads have been stable.
    pool: 'threads',
  },
});
