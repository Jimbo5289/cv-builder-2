/**
 * React Router Debug Utilities
 * Provides tools for debugging React Router issues
 */

import { useEffect } from 'react';

// Keep track of warnings to avoid duplicates
const seenWarnings = new Set();

/**
 * Component to enable detailed React Router debugging
 * Only use this in development mode
 */
export const RouterDebugMonitor = () => {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    
    console.log('[RouterDebug] React Router debug monitor activated');
    
    // Store the original console.warn
    const originalWarn = console.warn;
    
    // Replace console.warn to monitor React Router warnings
    console.warn = (...args) => {
      // Check if this is a React Router warning
      if (args[0] && typeof args[0] === 'string') {
        const message = args[0];
        
        if (message.includes('React Router')) {
          // Create a unique key for this warning
          const warningKey = message.slice(0, 100);
          
          // Only log each unique warning once
          if (!seenWarnings.has(warningKey)) {
            seenWarnings.add(warningKey);
            
            // Log the warning with special formatting
            console.groupCollapsed('%c React Router Warning Detected', 
              'background: #FEF3C7; color: #92400E; padding: 2px 4px; border-radius: 2px;');
            console.log('%c Message:', 'font-weight: bold', message);
            
            // Extract info from common warning patterns
            if (message.includes('future flag')) {
              const flagMatch = message.match(/['"]([^'"]+)['"]/);
              if (flagMatch) {
                const flag = flagMatch[1];
                console.log('%c Flag:', 'font-weight: bold', flag);
                console.log('%c Solution:', 'font-weight: bold', 
                  `Add this flag to your BrowserRouter: <BrowserRouter future={{ ${flag}: true }}>`);
              }
            }
            
            // Log the stack trace in a more readable format
            if (args[1] && args[1].stack) {
              console.log('%c Component:', 'font-weight: bold', 
                args[1].stack.split('\n')[1]?.trim() || 'Unknown');
            }
            
            console.log('%c To suppress this warning:', 'font-weight: bold', 
              'Use the RouterCompatibilityHandler component from utils/routerConfig');
            console.groupEnd();
          }
        }
      }
      
      // Call the original console.warn with all arguments
      originalWarn.apply(console, args);
    };
    
    // Cleanup function to restore original console.warn
    return () => {
      console.warn = originalWarn;
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

/**
 * Get debugging information about the current router state
 * @returns {Object} Debug information
 */
export const getRouterDebugInfo = () => {
  try {
    return {
      warnings: Array.from(seenWarnings),
      reactRouterVersion: getReactRouterVersion(),
      hasTransitionApi: typeof React !== 'undefined' && typeof React.startTransition === 'function'
    };
  } catch (e) {
    console.error('Error getting router debug info:', e);
    return { error: e.message };
  }
};

/**
 * Try to determine the React Router version
 * @returns {string} Version string or 'unknown'
 */
const getReactRouterVersion = () => {
  try {
    // This is a simple heuristic and not 100% reliable
    if (typeof window !== 'undefined') {
      const scripts = Array.from(document.querySelectorAll('script'));
      for (const script of scripts) {
        const src = script.src || '';
        const match = src.match(/react-router(?:-dom)?[@/]v?([\d.]+)/i);
        if (match) {
          return match[1];
        }
      }
    }
    return 'unknown';
  } catch (e) {
    return 'error';
  }
};

export default {
  RouterDebugMonitor,
  getRouterDebugInfo
}; 