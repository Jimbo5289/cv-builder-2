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
    ecmaVersion: 'latest',
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
    // Define common browser globals that ESLint might not recognize
    FormData: 'readonly',
    File: 'readonly',
    FileReader: 'readonly',
    Blob: 'readonly',
    XMLHttpRequest: 'readonly',
    fetch: 'readonly',
    localStorage: 'readonly',
    sessionStorage: 'readonly'
  },
  rules: {
    // Disable console warnings in development
    'no-console': 'off',
    
    // Be more lenient with unused vars
    'no-unused-vars': ['warn', { 
      vars: 'all', 
      args: 'after-used', 
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^(React|_)' // Ignore React import and variables starting with underscore
    }],
    
    // React rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
  },
  ignorePatterns: [
    'dist/**', 
    'build/**', 
    'node_modules/**', 
    'src/generated/**', 
    '.git/**'
  ]
}; 