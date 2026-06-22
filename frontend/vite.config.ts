import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // 前导 `.` 为 Vite 通配符，覆盖该域名下所有子域
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.io'],
  },
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
