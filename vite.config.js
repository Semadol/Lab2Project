import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/v1': {
        target: 'http://bank-service:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
