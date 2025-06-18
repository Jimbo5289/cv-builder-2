// ESLint Configuration for CV Builder
// Simple, dependency-free configuration for maximum compatibility

export default [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        FormData: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        XMLHttpRequest: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        
        // React globals
        React: 'readonly',
        JSX: 'readonly'
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
    },
    rules: {
      // Core ESLint rules
      'no-console': 'off',
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      'no-undef': 'error',
      'no-unreachable': 'warn',
      'no-constant-condition': 'warn',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'warn',
      'no-ex-assign': 'error',
      'no-extra-semi': 'warn',
      'no-func-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'warn',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      
      // Best practices
      'eqeqeq': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-global-assign': 'error',
      'no-redeclare': 'error'
    },
    ignores: [
      'dist/**', 
      'build/**', 
      'node_modules/**', 
      'src/generated/**', 
      '.git/**',
      'server/src/routes/cv.js',
      'server/src/middleware/auth.js',
      'src/components/CVPreviewResult.jsx',
      'src/components/CVPreviewWindow.jsx',
      'src/context/AuthContext.jsx',
      'src/context/PremiumBundleContext.jsx',
      'coverage/**',
      'logs/**',
      '*.config.js',
      'scripts/**'
    ]
  }
]; 