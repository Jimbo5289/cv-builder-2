module.exports = {
  // Extends the src directory configuration
  extends: [
    '../.eslintrc.js'
  ],
  
  // Rules specific to reusable components
  rules: {
    // More permissive for reusable components
    'no-unused-vars': ['warn', {
      varsIgnorePattern: '^(React|_|[A-Z][a-zA-Z]*)', // Ignore React, vars with _, and component names
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
      destructuredArrayIgnorePattern: '^_'
    }]
  }
}; 