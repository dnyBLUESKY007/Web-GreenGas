import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.VITE_BASE || '/',
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
        aboutCertifications: resolve(__dirname, 'about/certifications/index.html'),
        aboutClients: resolve(__dirname, 'about/clients/index.html'),
        products: resolve(__dirname, 'products/index.html'),
        industries: resolve(__dirname, 'industries/index.html'),
        support: resolve(__dirname, 'support/index.html'),
        cases: resolve(__dirname, 'cases/index.html'),
        solutions: resolve(__dirname, 'solutions/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        news: resolve(__dirname, 'news/index.html'),
        newsDetail: resolve(__dirname, 'news/detail/index.html'),
        faq: resolve(__dirname, 'faq/index.html'),
      },
    },
  },
});
