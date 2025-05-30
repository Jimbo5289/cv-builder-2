// direct-fix.js - A direct surgical fix for the i1.Component error
(function() {
  console.log('[direct-fix] Initializing direct surgical fix for i1.Component error');
  
  // Create a proxy for the i1 object with Component getter
  function createNamespaceWithComponent(originalObj) {
    return new Proxy(originalObj || {}, {
      get: function(target, prop) {
        if (prop === 'Component' && typeof React !== 'undefined') {
          console.log('[direct-fix] Intercepted access to Component property');
          return React.Component;
        }
        return target[prop];
      },
      set: function(target, prop, value) {
        target[prop] = value;
        return true;
      }
    });
  }
  
  // Hijack global property accessors
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    // Intercept any definition of 'i1' global object
    if (prop === 'i1') {
      console.log('[direct-fix] Intercepted definition of i1');
      if (descriptor.value) {
        descriptor.value = createNamespaceWithComponent(descriptor.value);
      }
      if (descriptor.get) {
        const originalGetter = descriptor.get;
        descriptor.get = function() {
          const result = originalGetter.apply(this);
          return createNamespaceWithComponent(result);
        };
      }
    }
    
    // Call original method
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  // Set up watcher for window.i1
  let i1Value = window.i1;
  Object.defineProperty(window, 'i1', {
    get: function() {
      return i1Value;
    },
    set: function(newValue) {
      console.log('[direct-fix] i1 value changed', newValue);
      i1Value = createNamespaceWithComponent(newValue);
    },
    configurable: true
  });
  
  // Create universal Component reference if missing
  if (typeof window.Component === 'undefined' && typeof React !== 'undefined') {
    console.log('[direct-fix] Creating global Component reference');
    window.Component = React.Component;
  }
  
  // Find and patch module system
  // For webpack and similar bundlers
  const modulePatches = () => {
    try {
      // Try to find the webpack module cache or similar structure
      for (let globalKey in window) {
        if (typeof window[globalKey] === 'object' && window[globalKey] !== null) {
          const obj = window[globalKey];
          
          // Look for module cache patterns
          if (obj.__webpack_modules__ || obj.__webpack_require__ || 
              obj.c || obj.m || (typeof obj === 'object' && Object.keys(obj).some(k => /^[0-9]+$/.test(k)))) {
            
            console.log('[direct-fix] Potential module system found:', globalKey);
            
            // For webpack 4/5 and similar
            if (obj.__webpack_require__ && obj.c) {
              const originalRequire = obj.__webpack_require__;
              obj.__webpack_require__ = function(moduleId) {
                const result = originalRequire(moduleId);
                // Patch Component reference if it's a React module
                if (result && typeof result === 'object' && !result.Component && 
                    (result.createElement || result.useState || result.useEffect)) {
                  console.log('[direct-fix] Patching React module:', moduleId);
                  result.Component = React.Component;
                }
                return result;
              };
              
              // Also patch the module cache
              if (obj.c) {
                const originalC = obj.c;
                Object.defineProperty(obj, 'c', {
                  get: function() {
                    return originalC;
                  },
                  set: function(newCache) {
                    console.log('[direct-fix] Module cache updated');
                    // When new modules are added to cache, intercept them
                    Object.defineProperty(newCache, 'i1', {
                      configurable: true,
                      enumerable: true,
                      get: function() {
                        if (originalC.i1) {
                          return createNamespaceWithComponent(originalC.i1);
                        }
                        return undefined;
                      },
                      set: function(val) {
                        originalC.i1 = createNamespaceWithComponent(val);
                      }
                    });
                    originalC = newCache;
                  },
                  configurable: true
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('[direct-fix] Error patching module system:', e);
    }
  };
  
  // Try module patching once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', modulePatches);
  } else {
    modulePatches();
  }
  
  // Also patch after React is loaded
  const checkReactAndPatch = () => {
    if (typeof React !== 'undefined') {
      console.log('[direct-fix] React detected, applying patches');
      
      // Ensure Component is added to React
      if (!React.Component) {
        console.log('[direct-fix] Adding Component to React');
        // Try to find a component class
        for (let key in React) {
          if (typeof React[key] === 'function' && /^[A-Z]/.test(key)) {
            React.Component = React[key];
            break;
          }
        }
      }
      
      // If i1 exists, ensure it has Component
      if (window.i1 && !window.i1.Component) {
        console.log('[direct-fix] Adding Component to existing i1');
        window.i1.Component = React.Component;
      }
      
      // Run module patching again
      modulePatches();
      
      // Clear the interval if we've successfully patched
      if (window.i1 && window.i1.Component) {
        clearInterval(reactCheckInterval);
      }
    }
  };
  
  // Check periodically for React and patch when available
  const reactCheckInterval = setInterval(checkReactAndPatch, 100);
  
  // Also try immediately
  checkReactAndPatch();
  
  // Attach to error event to catch and fix on demand
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && 
        (event.error.message.includes('i1.Component') || 
        event.error.message.includes('undefined is not an object'))) {
      
      console.log('[direct-fix] Error caught, attempting to fix:', event.error.message);
      
      // Create i1 with Component if needed
      if (!window.i1) {
        console.log('[direct-fix] Creating i1 object');
        window.i1 = {};
      }
      
      // Add Component to i1
      if (!window.i1.Component && typeof React !== 'undefined') {
        console.log('[direct-fix] Adding Component to i1');
        window.i1.Component = React.Component;
      }
      
      // Force patches to run again
      modulePatches();
      checkReactAndPatch();
    }
  });
  
  console.log('[direct-fix] Initialization completed');
})(); 