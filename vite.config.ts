import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // static hosting anywhere; routing is hash-based
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts', 'spikes/**/*.test.{ts,tsx}'],
    // node by default; DOM tests opt in with `// @vitest-environment happy-dom`. jsdom took 94–113 s to load
    // cold here, past Vitest's fixed 60 s worker start timeout, so its tests never ran.
    environment: 'node',
    // Forks workers intermittently time out starting on this Windows machine (seen twice); threads have been stable.
    pool: 'threads',
  },
});
