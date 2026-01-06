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
        manualChunks: (id) => {
          // More granular code splitting for better caching and reduced unused code
          if (id.includes('node_modules')) {
            // React core - keep together to avoid version conflicts
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            // React Router separate
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            // Animation libraries - split further
            if (id.includes('gsap') || id.includes('@gsap')) {
              return 'gsap-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer-vendor';
            }
            if (id.includes('@react-spring')) {
              return 'spring-vendor';
            }
            // Scroll libraries
            if (id.includes('locomotive-scroll')) {
              return 'scroll-vendor';
            }
            // Form and UI utilities
            if (id.includes('@formspree') || id.includes('react-confetti')) {
              return 'form-vendor';
            }
            // Particle and effect libraries
            if (id.includes('tsparticles') || id.includes('react-tsparticles')) {
              return 'particles-vendor';
            }
            // Other animation/parallax libraries
            if (id.includes('rellax') || id.includes('react-parallax') || id.includes('react-scroll-parallax') || id.includes('aos')) {
              return 'parallax-vendor';
            }
            // Typing effects
            if (id.includes('react-typed') || id.includes('react-typing-effect')) {
              return 'typing-vendor';
            }
            // Small utilities
            if (id.includes('react-icons') || id.includes('react-intersection-observer') || id.includes('lenis')) {
              return 'utils-vendor';
            }
            // Other vendor libraries (firebase, prop-types, etc.)
            return 'vendor';
          }
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
    // Tree shaking - preserve React side effects
    treeshake: {
      moduleSideEffects: (id) => {
        // Preserve side effects for React and related packages
        if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
          return true;
        }
        return false;
      },
    },
  },
})
