import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    strictPort: false, // Try next available port if 5173 is taken
    open: false, // Don't auto-open browser
  },
  resolve: {
    // Fix for prop-types and other CommonJS modules
    dedupe: ['prop-types', 'react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'gsap',
      'framer-motion',
      'prop-types', // Explicitly include prop-types
      '@stripe/react-stripe-js', // Include stripe to fix module resolution
    ],
    esbuildOptions: {
      // Fix for CommonJS modules
      mainFields: ['module', 'main'],
    },
  },
  build: {
    // Optimize build output
    target: 'es2015',
    minify: 'esbuild', // Use esbuild for faster builds (built-in, no extra dependency)
    // Note: esbuild doesn't support drop_console, but it's faster
    // For production, you can use terser if needed by installing: npm install -D terser
    // Code splitting and chunking optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // React core bundle
          'react-vendor': ['react', 'react-dom', 'scheduler'],
          // Router
          'router-vendor': ['react-router-dom'],
          // Animation libraries
          'animation-vendor': ['framer-motion', 'gsap'],
          // Scroll library
          'scroll-vendor': ['locomotive-scroll', 'react-locomotive-scroll'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[ext]/[name]-[hash][extname]';
        },
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Source maps for production (optional - set to false for smaller builds)
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    // Reduce bundle size
    reportCompressedSize: true,
  },
})
