/**
 * React References Fix Script
 * This script fixes common reference issues after React is loaded
 */

/* eslint-disable no-undef */

(function() {
  // Console log wrapper with prefix for debugging
  const logFix = function(message) {
    console.log('[ReactFix] ' + message);
  };

  logFix('React references fix script initialized');
  
  // Wait until React is defined
  const checkAndFixReact = function() {
    if (typeof window.React === 'undefined') {
      logFix('React not yet available, waiting...');
      setTimeout(checkAndFixReact, 100);
      return;
    }
    
    logFix('React found, fixing references...');
    
    try {
      // Fix i1.Component reference
      if (typeof window.i1 === 'undefined') {
        window.i1 = {};
      }
      
      // Set Component references
      if (typeof window.React !== 'undefined') {
        window.i1.Component = window.React.Component;
        window.Component = window.React.Component;
      }
      
      // Fix lazy loading references 
      if (typeof window.React !== 'undefined' && typeof window.React.lazy === 'function') {
        // Save original React.lazy
        const originalLazy = window.React.lazy;
        
        // Patch React.lazy to handle errors better
        window.React.lazy = function patchedLazy(loader) {
          // Wrap the loader function to catch errors
          const wrappedLoader = function() {
            return loader().catch(error => {
              console.error('Error loading lazy component:', error);
              // Return a simple fallback component
              return {
                default: function LazyLoadError() {
                  return window.React.createElement('div', {
                    style: {
                      padding: '1rem',
                      border: '1px solid #e53e3e',
                      borderRadius: '0.25rem',
                      color: '#e53e3e',
                      backgroundColor: '#fff5f5',
                      textAlign: 'center'
                    }
                  }, 'Failed to load component');
                }
              };
            });
          };
          
          return originalLazy(wrappedLoader);
        };
        
        logFix('React.lazy patched successfully');
      }
      
      // Patch createElement to be more resilient
      if (typeof window.React.createElement === 'function') {
        const originalCreateElement = window.React.createElement;
        
        window.React.createElement = function patchedCreateElement(type, props, ...children) {
          // Handle missing or invalid component types
          if (type === undefined || type === null) {
            console.error('Invalid component type in createElement:', type);
            // Use a div as fallback
            return originalCreateElement('div', {
              style: {
                padding: '0.5rem',
                border: '1px dashed #e53e3e',
                color: '#e53e3e',
                display: 'inline-block'
              }
            }, 'Invalid Component');
          }
          
          // Standard createElement call
          return originalCreateElement(type, props, ...children);
        };
        
        logFix('React.createElement patched successfully');
      }
      
      logFix('React references fixed successfully');
    } catch (e) {
      console.error('Error fixing React references:', e);
    }
  };
  
  // Start checking
  checkAndFixReact();
  
  // Also run once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndFixReact);
  }
})(); 