// Fix for Component reference error (i1.Component)
(function() {
  console.log('Running Component fix script');
  
  // Create a function to fix React references
  function fixReactReferences() {
    try {
      // Check if React is available
      if (typeof React !== 'undefined') {
        console.log('React is defined, version:', React.version);
        
        // Make Component available globally
        if (!window.Component && React.Component) {
          console.log('Fixing Component reference');
          window.Component = React.Component;
        }
        
        // Fix potential namespace issues
        if (typeof i1 !== 'undefined' && !i1.Component && React.Component) {
          console.log('Fixing i1.Component reference');
          i1.Component = React.Component;
        }
        
        // Fix possible module mapping issues
        const modules = ['i1', 'r', '_', '__', 'e', 'n', 't', 'o'];
        modules.forEach(modName => {
          if (typeof window[modName] !== 'undefined' && !window[modName].Component) {
            console.log(`Fixing ${modName}.Component reference`);
            window[modName].Component = React.Component;
          }
        });
        
        console.log('Component fix completed');
        return true;
      } else {
        console.error('React not defined, cannot fix Component reference');
        return false;
      }
    } catch (e) {
      console.error('Error in Component fix:', e);
      return false;
    }
  }
  
  // Run fix immediately
  const initialFixResult = fixReactReferences();
  console.log('Initial fix result:', initialFixResult);
  
  // Also run after a delay to catch late-loaded React
  setTimeout(() => {
    const delayedFixResult = fixReactReferences();
    console.log('Delayed fix result:', delayedFixResult);
  }, 1000);
  
  // Set up global error handler for Component-related errors
  window.addEventListener('error', function(e) {
    if (e && e.message && (
      e.message.includes('Component') || 
      e.message.includes('undefined is not an object') ||
      e.message.includes('i1.Component')
    )) {
      console.warn('Caught Component-related error:', e.message);
      fixReactReferences();
      
      // If we still don't have React, load it from CDN
      if (typeof React === 'undefined') {
        console.warn('Loading React from CDN after error');
        
        const reactScript = document.createElement('script');
        reactScript.src = 'https://unpkg.com/react@18.2.0/umd/react.production.min.js';
        reactScript.crossOrigin = 'anonymous';
        
        const reactDomScript = document.createElement('script');
        reactDomScript.src = 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js';
        reactDomScript.crossOrigin = 'anonymous';
        
        // Add them to the document
        document.head.appendChild(reactScript);
        document.head.appendChild(reactDomScript);
        
        // Run fix again after scripts load
        reactDomScript.onload = function() {
          setTimeout(fixReactReferences, 100);
        };
      }
    }
  });
})(); 