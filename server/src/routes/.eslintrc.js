/* eslint-disable */
module.exports = {
  rules: {
    // Allow unused variables in route files since many parameters are defined by Express conventions
    'no-unused-vars': 'off',
    // Turn off no-undef warnings in route files, which are often filled with globals
    'no-undef': 'off'
  }
}; 