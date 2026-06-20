import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        solutions: resolve(__dirname, 'solutions/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        news: resolve(__dirname, 'news/index.html'),
      },
    },
  },
});
