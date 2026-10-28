import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const here = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: here,
  plugins: [react()],
  build: {
    outDir: resolve(here, 'dist'),
    rollupOptions: {
      input: {
        index: resolve(here, 'index.html'),
        s1: resolve(here, 's1-plan-editor/index.html'),
        s2: resolve(here, 's2-massing/index.html'),
      },
    },
  },
});
