import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production' || process.env.NODE_ENV === 'production';

  return {
    base: isProduction ? '/TryCatch75/' : '/',
    plugins: [
      react(),
    ],
    server: {
      port: 5173,
      open: true,
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-charts': ['recharts'],
            'vendor-motion': ['framer-motion'],
            'vendor-utils': ['date-fns', 'lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 500,
    },
  };
});
