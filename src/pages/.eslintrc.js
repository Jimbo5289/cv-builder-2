module.exports = {
  // Extends the src directory configuration
  extends: [
    '../.eslintrc.js'
  ],
  
  // Rules specific to page components
  rules: {
    // Even more permissive for page components
    'no-unused-vars': 'off', // Turn off unused vars for pages
    
    // Disable exhaustive-deps warnings for page components
    'react-hooks/exhaustive-deps': 'off'
  }
}; 
 