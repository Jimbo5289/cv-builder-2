// lazy-component-fix.js - Specifically addresses issues with lazy-loaded React components
(function() {
  console.log('[lazy-fix] Initializing lazy component fix');

  // Keep track of original lazy implementation
  let originalLazy;
  
  // Function to patch React.lazy
  const patchReactLazy = () => {
    if (typeof React !== 'undefined' && React.lazy && !originalLazy) {
      console.log('[lazy-fix] Patching React.lazy');
      
      // Store original implementation
      originalLazy = React.lazy;
      
      // Create enhanced version
      React.lazy = function(factory) {
        // Wrap the original factory to ensure Component is always present
        const enhancedFactory = () => {
          return factory().then(module => {
            // Handle both ESM and CommonJS modules
            const Component = module.default || module;
            
            // Ensure Component has all necessary React.Component properties
            if (Component && !Component.Component && React.Component) {
              console.log('[lazy-fix] Adding Component to lazy-loaded component');
              Component.Component = React.Component;
            }
            
            // Make sure default export is properly handled
            if (!module.default && module.Component) {
              module.default = module.Component;
            }
            
            return module;
          });
        };
        
        // Call original lazy with enhanced factory
        const lazyComponent = originalLazy(enhancedFactory);
        
        // Add Component property to the lazy component itself
        if (React.Component) {
          lazyComponent.Component = React.Component;
        }
        
        return lazyComponent;
      };
    }
  };
  
  // Function to patch Suspense
  const patchSuspense = () => {
    if (typeof React !== 'undefined' && React.Suspense) {
      console.log('[lazy-fix] Patching React.Suspense');
      
      // Ensure Suspense has Component property
      if (!React.Suspense.Component && React.Component) {
        React.Suspense.Component = React.Component;
      }
    }
  };
  
  // Modify module initialization
  const patchLazyLoading = () => {
    // Patch for dynamic imports
    const originalImport = window.import;
    if (typeof originalImport === 'function') {
      window.import = function(specifier) {
        return originalImport(specifier).then(module => {
          // For ESM modules, ensure all exports have Component property
          if (module && typeof module === 'object') {
            for (const key in module) {
              if (typeof module[key] === 'function' && !module[key].Component && typeof React !== 'undefined') {
                module[key].Component = React.Component;
              }
            }
            
            // If this looks like a React component module, add Component
            if (module.default && typeof module.default === 'function' && !module.default.Component && typeof React !== 'undefined') {
              console.log('[lazy-fix] Adding Component to dynamically imported module', specifier);
              module.default.Component = React.Component;
              // Also add Component to the module itself
              module.Component = React.Component;
            }
          }
          return module;
        });
      };
    }
  };
  
  // Check for React and apply patches
  const tryPatching = () => {
    if (typeof React !== 'undefined') {
      patchReactLazy();
      patchSuspense();
      patchLazyLoading();
      
      // If successful, stop checking
      if (originalLazy) {
        clearInterval(patchInterval);
      }
    }
  };
  
  // Try immediately
  tryPatching();
  
  // And periodically check if React is loaded
  const patchInterval = setInterval(tryPatching, 100);
  
  // Also try after DOMContentLoaded
  document.addEventListener('DOMContentLoaded', tryPatching);
  
  // Setup error handler for lazy component errors
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && 
        (event.error.message.includes('_result.default') || 
         event.error.message.includes('i1.Component') || 
         event.error.message.includes('React.lazy'))) {
      
      console.log('[lazy-fix] Caught lazy loading error:', event.error.message);
      
      // Apply patches again
      tryPatching();
    }
  });
  
  console.log('[lazy-fix] Initialization completed');
})(); 