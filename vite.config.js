import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production' || process.env.NODE_ENV === 'production';

  return {
    base: isProduction ? '/TryCatch75/' : '/',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'TryCatch75 — Attendance Tracker',
          short_name: 'TryCatch75',
          description: 'Smart attendance management for Indian engineering students',
          theme_color: '#0a0a0f',
          background_color: '#0a0a0f',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: 'favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallbackAllowlist: [/^(?!\/__).*/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
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
