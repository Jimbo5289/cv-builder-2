module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react',
    'react-hooks',
    'react-refresh'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  globals: {
    // Define common browser globals
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
    require: 'readonly',
    module: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
    Buffer: 'readonly',
    setImmediate: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
    global: 'readonly'
  },
  rules: {
    // Disable console warnings in development
    'no-console': 'off',
    
    // Set unused vars to warning only and ignore pattern
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_|^req$|^res$|^next$', 
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      ignoreRestSiblings: true 
    }],
    
    // Allow globals typically used in Node.js environment
    'no-undef': 'warn',
    
    // Disable other problematic rules
    'no-prototype-builtins': 'off',
    
    // React rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
  },
  // Add overrides for specific directories/files
  overrides: [
    {
      // For server files
      files: ['server/src/**/*.js'],
      env: {
        node: true,
        browser: false
      },
      rules: {
        'no-unused-vars': 'off',
        'no-undef': 'off'
      }
    },
    {
      // For test files
      files: ['**/*.test.js', '**/*.test.jsx', '**/__tests__/**/*.js'],
      env: {
        jest: true,
        node: true
      },
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off'
      }
    }
  ],
  ignorePatterns: [
    'dist/**', 
    'build/**', 
    'node_modules/**', 
    'src/generated/**', 
    '.git/**',
    'server/src/routes/cv.js',
    'server/src/routes/auth.js',
    'server/src/middleware/auth.js'
  ]
}; 