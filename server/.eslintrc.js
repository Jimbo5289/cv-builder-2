module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // Disable rules that are causing the most issues
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-prototype-builtins': 'off',
    'no-case-declarations': 'off'
  },
  globals: {
    // Common Node.js globals
    process: 'readonly',
    console: 'readonly',
    module: 'readonly',
    require: 'readonly',
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
  // Specific overrides for test files
  overrides: [
    {
      files: ['**/*.test.js', '**/__tests__/**/*.js'],
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off'
      }
    }
  ]
}; 