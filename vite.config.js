import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js — huge (938KB), only used in lazy HeroScene
          // Keep it in its own chunk so it's NEVER preloaded with the page
          if (id.includes('node_modules/three') ||
              id.includes('@react-three/fiber') ||
              id.includes('@react-three/drei')) {
            return 'vendor-three';
          }
          // GSAP — needed globally but can be loaded after FCP
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          // Lucide icons — tree-shakeable, keep separate for caching
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // React + ReactDOM — critical, must load first
          if (id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
        }
      }
    },
    // Disable automatic modulepreload injection for ALL chunks.
    // This prevents vendor-three (938KB) from being preloaded on every page.
    // The browser will still load chunks on demand via dynamic import().
    modulePreload: false,
    // Raise chunk size warning limit slightly
    chunkSizeWarningLimit: 1000,
    // Minify with esbuild (default, very fast)
    minify: 'esbuild',
    // Enable CSS code splitting — only load CSS needed per route
    cssCodeSplit: true,
    // Target modern browsers — smaller output, no IE polyfills
    target: 'es2020',
  }
});
