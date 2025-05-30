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
      react(),
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
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
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
          }
        }
      }
    }
  }
})
