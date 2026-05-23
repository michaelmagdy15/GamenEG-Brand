import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      // vite-plugin-image-optimizer uses sharp (prebuilt binaries) — no C compiler needed in Docker
      ViteImageOptimizer({
        jpg:  { quality: 78 },
        jpeg: { quality: 78 },
        png:  { quality: 80 },
        webp: { quality: 80 },
        svg:  { multipass: true, plugins: [{ name: 'removeViewBox', active: false }] },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion':   ['motion'],
            'vendor-three':    ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
            'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'vendor-icons':    ['lucide-react'],
          },
        },
      },
    },
  };
});
