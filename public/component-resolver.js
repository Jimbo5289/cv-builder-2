// component-resolver.js
// This script ensures that React components are properly resolved in production builds

(function() {
  console.log('Running component resolver script');
  
  // Store the original React.createElement function
  if (typeof React !== 'undefined' && React.createElement) {
    const originalCreateElement = React.createElement;
    
    // Override React.createElement to handle objects that should be functions
    React.createElement = function(type, props, ...children) {
      // Handle the specific case where type is an object with a default property
      // This fixes the "i1.Component" error in production builds
      if (type && typeof type === 'object') {
        if (type.default && typeof type.default === 'function') {
          console.log('Resolved component from object.default');
          return originalCreateElement(type.default, props, ...children);
        }
        
        // If the object has a Component property (handles i1.Component case)
        if (type.Component && typeof type.Component === 'function') {
          console.log('Resolved i1.Component case');
          return originalCreateElement(type.Component, props, ...children);
        }
        
        // For other cases, try to find a suitable component function
        const componentKeys = Object.keys(type).filter(key => 
          typeof type[key] === 'function' && 
          /^[A-Z]/.test(key) // Component names start with uppercase
        );
        
        if (componentKeys.length > 0) {
          console.log('Resolved component from object keys:', componentKeys[0]);
          return originalCreateElement(type[componentKeys[0]], props, ...children);
        }
        
        console.warn('Unable to resolve component from object:', type);
      }
      
      // Default case - just call the original function
      return originalCreateElement(type, props, ...children);
    };
    
    console.log('React.createElement successfully patched for production builds');
  } else {
    console.warn('React not found or React.createElement not available');
  }
  
  // Fix module namespace object handling in minified code
  // This specifically targets the i1.Component error
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && 
        (event.error.message.includes('i1.Component') || 
         event.error.message.includes('undefined is not an object'))) {
      
      console.warn('Caught component error, attempting to fix:', event.error.message);
      
      // Attempt to define the missing property
      try {
        // Create a registry of known component namespaces
        const namespaces = ['i1', 'r', '_', 'o', 'e', 'u'];
        
        namespaces.forEach(ns => {
          if (window[ns] && typeof window[ns] === 'object' && !window[ns].Component && window.React) {
            console.log(`Adding Component to ${ns} namespace`);
            window[ns].Component = window.React.Component;
          }
        });
        
        // If we have access to specific error details, try to parse and fix
        const match = event.error.message.match(/([a-zA-Z0-9_]+)\.Component/);
        if (match && match[1]) {
          const namespace = match[1];
          if (window[namespace] && !window[namespace].Component && window.React) {
            console.log(`Adding Component to ${namespace} namespace`);
            window[namespace].Component = window.React.Component;
          }
        }
      } catch (e) {
        console.error('Error while trying to fix component issue:', e);
      }
    }
  });
})(); 