import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Custom plugin to inject Google Analytics ID
const injectGoogleAnalytics = () => {
  return {
    name: 'inject-google-analytics',
    transformIndexHtml(html) {
      const gaId = process.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
      return html.replace(/GA_MEASUREMENT_ID_PLACEHOLDER/g, gaId);
    }
  };
};

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
      injectGoogleAnalytics()
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
      // Add specific Safari support
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        clientPort: 5173,
      },
      // Fallback to serve index.html for any non-file requests (SPA routing)
      historyApiFallback: {
        index: '/index.html',
        disableDotRule: true,
        rewrites: [
          // Don't apply the fallback to API routes
          { from: /^\/api\/.*$/, to: function(context) {
            return context.parsedUrl.pathname;
          }}
        ]
      },
      middlewareMode: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      },
      // Ensure .jsx files are properly resolved
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      // Preserve valid package exports
      preserveSymlinks: false,
    },
    // Add history API fallback manually
    appType: 'spa',
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      // Ensure React is part of the initial bundle
      assetsInlineLimit: 0,
      // Prevent mangling of component names in production
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
        },
        mangle: {
          // Don't mangle component names to avoid runtime issues
          keep_classnames: true,
          keep_fnames: true,
        },
        format: {
          // Preserve comments for better debugging
          comments: false,
        },
      },
      commonjsOptions: {
        // Improve handling of CommonJS modules
        transformMixedEsModules: true,
        // Keep original names to avoid reference issues
        strictRequires: true,
      },
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
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // Ensure exports are properly preserved
          preserveModules: false,
          format: 'es',
          // Avoid hashing for better stability and readability
          experimentalMinChunkSize: 10000,
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      force: true,
      // Ensure ESM modules are properly processed
      esbuildOptions: {
        keepNames: true, // Preserve class and function names
        target: 'es2020',
        supported: {
          'dynamic-import': true
        },
      }
    },
    define: {
      // Define these values at build time
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_DEV_MODE': JSON.stringify(env.VITE_DEV_MODE || 'false'),
      'process.env.VITE_SKIP_AUTH': JSON.stringify(env.VITE_SKIP_AUTH || 'false'),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:3001'),
      'process.env.VITE_FRONTEND_URL': JSON.stringify(env.VITE_FRONTEND_URL || 'http://localhost:5173'),
      'process.env.VITE_GA_MEASUREMENT_ID': JSON.stringify(env.VITE_GA_MEASUREMENT_ID || ''),
      'process.env.VITE_MOCK_SUBSCRIPTION_DATA': JSON.stringify(env.VITE_MOCK_SUBSCRIPTION_DATA || 'false'),
      'process.env.VITE_PREMIUM_FEATURES_ENABLED': JSON.stringify(env.VITE_PREMIUM_FEATURES_ENABLED || 'false'),
      'process.env.VITE_ENABLE_ALL_ROUTES': JSON.stringify(env.VITE_ENABLE_ALL_ROUTES || 'false'),
      'process.env.VITE_BYPASS_PAYMENT': JSON.stringify(env.VITE_BYPASS_PAYMENT || 'false'),
      'process.env.VITE_ADMIN_ACCESS': JSON.stringify(env.VITE_ADMIN_ACCESS || 'false'),
      'process.env.VITE_MOCK_PREMIUM_USER': JSON.stringify(env.VITE_MOCK_PREMIUM_USER || 'false'),
      'process.env.VITE_ENVIRONMENT': JSON.stringify(env.VITE_ENVIRONMENT || 'development'),
      'process.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY || ''),
      'process.env.VITE_TURNSTILE_SITE_KEY': JSON.stringify(env.VITE_TURNSTILE_SITE_KEY || ''),
      'process.env.VITE_MAILCHIMP_API_KEY': JSON.stringify(env.VITE_MAILCHIMP_API_KEY || ''),
      'process.env.VITE_MAILCHIMP_LIST_ID': JSON.stringify(env.VITE_MAILCHIMP_LIST_ID || ''),
      'process.env.VITE_SENTRY_DSN': JSON.stringify(env.VITE_SENTRY_DSN || '')
    },
    assetsInclude: ['**/*.md']
  }
})
