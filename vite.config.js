import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        // React plugin options for better error handling
        fastRefresh: true,
        jsxRuntime: 'automatic',
        babel: {
          presets: [],
          plugins: [],
          babelrc: false,
          configFile: false,
        }
      }),
    ],
    server: {
      port: 5173,
      strictPort: false,
      host: true,
      watch: {
        usePolling: true,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3005',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
      // Ensure React is part of the initial bundle
      assetsInlineLimit: 0,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          test: path.resolve(__dirname, 'public/test.html'),
          fallback: path.resolve(__dirname, 'public/fallback.html'),
          fallbackReact: path.resolve(__dirname, 'public/fallback-react.html'),
        },
        output: {
          // Ensure React is given a reliable chunk name
          manualChunks: (id) => {
            // React and ReactDOM go in their own chunk that loads first
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/react-dom') ||
                id.includes('node_modules/scheduler')) {
              return 'react-vendor';
            }
            
            if (id.includes('node_modules/react-router') ||
                id.includes('node_modules/react-router-dom') ||
                id.includes('node_modules/history') ||
                id.includes('node_modules/@remix-run')) {
              return 'router';
            }
            
            if (id.includes('node_modules/@headlessui') ||
                id.includes('node_modules/@heroicons') ||
                id.includes('node_modules/tailwindcss')) {
              return 'ui-libs';
            }
            
            if (id.includes('node_modules/html2canvas') ||
                id.includes('node_modules/jspdf') ||
                id.includes('node_modules/pdfjs')) {
              return 'pdf-libs';
            }
            
            if (id.includes('node_modules/chart.js') ||
                id.includes('node_modules/react-chartjs')) {
              return 'chart-libs';
            }
            
            if (id.includes('node_modules/formik') ||
                id.includes('node_modules/yup') ||
                id.includes('node_modules/react-hook-form')) {
              return 'form-libs';
            }
            
            if (id.includes('node_modules/lodash') ||
                id.includes('node_modules/date-fns') ||
                id.includes('node_modules/uuid')) {
              return 'utils';
            }
            
            if (id.includes('node_modules/@stripe') ||
                id.includes('node_modules/stripe')) {
              return 'stripe';
            }
            
            if (id.includes('/src/pages/Preview.jsx') ||
                id.includes('/src/components/CVPreview')) {
              return 'preview';
            }
            
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          // Make sure chunks are properly loaded in the right order
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      force: true
    },
    define: {
      // Define these values at build time
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_DEV_MODE': JSON.stringify(env.VITE_DEV_MODE || 'false'),
      'process.env.VITE_SKIP_AUTH': JSON.stringify(env.VITE_SKIP_AUTH || 'false'),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || '')
    }
  }
})
