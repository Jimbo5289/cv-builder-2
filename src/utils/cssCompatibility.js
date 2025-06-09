/**
 * CSS Compatibility Utilities
 * Provides functions to handle CSS compatibility issues across browsers
 */

/**
 * Check if the browser supports a particular CSS feature
 * @param {string} feature - CSS feature to check
 * @returns {boolean} - Whether the feature is supported
 */
export const isFeatureSupported = (feature) => {
  // Use CSS.supports if available
  if (typeof CSS !== 'undefined' && CSS.supports) {
    try {
      return CSS.supports(feature);
    } catch (e) {
      console.warn(`Error checking CSS support for ${feature}:`, e);
      return false;
    }
  }
  
  // Fallback method: create a dummy element and try to set the property
  try {
    const dummy = document.createElement('div');
    
    // Extract property name and value from the feature string
    // e.g., "display: flex" -> ["display", "flex"]
    const parts = feature.split(':').map(part => part.trim());
    
    if (parts.length >= 2) {
      const property = parts[0];
      const value = parts.slice(1).join(':');
      
      dummy.style[property] = value;
      return dummy.style[property] !== '';
    }
    
    return false;
  } catch (e) {
    console.warn(`Error in feature detection for ${feature}:`, e);
    return false;
  }
};

/**
 * Suppress known CSS warning messages that can't be fixed
 * This is called when the app initializes
 */
export const suppressCssWarnings = () => {
  // Store the original console.warn
  const originalWarn = console.warn;
  
  // Replace console.warn with our filtered version
  console.warn = function(...args) {
    // Skip warnings about @media (min-width: 640px)
    const message = args[0] || '';
    
    if (typeof message === 'string' && 
        (message.includes('@media (min-width:') || 
         message.includes('Unsupported style property') ||
         message.includes('unknown media'))) {
      // Suppress these warnings
      return;
    }
    
    // For all other warnings, use the original console.warn
    return originalWarn.apply(console, args);
  };
};

export default { isFeatureSupported, suppressCssWarnings }; 