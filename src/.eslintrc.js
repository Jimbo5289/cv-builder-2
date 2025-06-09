module.exports = {
  // Extends the parent configuration
  extends: [
    '../.eslintrc.js'
  ],
  
  // Override rules for React components
  rules: {
    // More permissive rules for React components
    'no-unused-vars': ['warn', {
      varsIgnorePattern: '^(React|_|[A-Z][a-zA-Z]*)', // Ignore React, vars with _, and component names (PascalCase)
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }],
    
    // Allow certain pattern of unused imports/vars in React files
    'react/jsx-uses-vars': 'warn',
    'react/jsx-uses-react': 'warn'
  }
}; 