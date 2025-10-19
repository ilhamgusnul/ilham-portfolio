import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: process.cwd(),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(process.cwd(), 'index.html')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    }
  },
  publicDir: 'public'
});
