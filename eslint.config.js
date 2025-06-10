// @ts-check
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';

// Legacy config adapter
const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ),
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        FormData: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        XMLHttpRequest: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        process: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
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
      'src/context/PremiumBundleContext.jsx'
    ]
  }
];
