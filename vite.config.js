import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        academy: resolve(__dirname, 'services/academy.html'),
        connect: resolve(__dirname, 'services/connect.html'),
        digital: resolve(__dirname, 'services/digital.html'),
        diplomacy: resolve(__dirname, 'services/diplomacy.html'),
        prive: resolve(__dirname, 'services/prive.html'),
        trade: resolve(__dirname, 'services/trade.html'),
        translation: resolve(__dirname, 'services/translation.html'),
        voice: resolve(__dirname, 'services/voice.html')
        // Note: edu-connect.html excluded due to malformed HTML (script before DOCTYPE)
      },
      output: {
        manualChunks: {
          vendor: ['leaflet'],
          i18n: ['./src/js/i18n.js']
        }
      }
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  preview: {
    port: 8080,
    open: true
  },
  plugins: [
    createHtmlPlugin({
      minify: true
    })
  ]
});
