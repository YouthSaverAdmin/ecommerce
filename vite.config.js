import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Proxy ONLY in dev mode
      proxy: command === 'serve' ? {
        '/api': 'http://localhost:8000', // local backend dev server
      } : undefined,
    },
    build: {
      outDir: 'dist',
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    base: '/',
  };
});
