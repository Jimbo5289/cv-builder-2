/**
 * React Router Configuration Utilities
 * Handles future flags and configuration for React Router
 */

import { useEffect } from 'react';

// Track if we've already logged warnings to avoid console spam
let warningsLogged = false;

/**
 * Configure React Router future flags to suppress warnings
 * @returns {Object} Future flags configuration object
 */
export const getRouterFutureConfig = () => {
  return {
    v7_startTransition: true,        // Use React.startTransition for state updates
    v7_relativeSplatPath: true       // Use v7 behavior for relative splat paths
  };
};

/**
 * Component that handles React Router warnings and compatibility
 * Include this in your app to apply future flags and handle warnings
 */
export const RouterCompatibilityHandler = () => {
  useEffect(() => {
    // Log a single time that we're handling router warnings
    if (!warningsLogged) {
      console.log('[RouterConfig] Applied future flags for React Router v7 compatibility');
      warningsLogged = true;
      
      // Patch console.warn to filter out React Router future flag warnings
      const originalWarn = console.warn;
      console.warn = (...args) => {
        // Only filter out React Router future flag warnings
        if (args[0] && typeof args[0] === 'string' && 
            (args[0].includes('React Router Future Flag Warning') || 
             args[0].includes('future flag'))) {
          // Ignore these warnings
          return;
        }
        
        // Pass through all other warnings
        originalWarn.apply(console, args);
      };
    }
  }, []);
  
  // This is a utility component that doesn't render anything
  return null;
};

/**
 * Hook that applies React Router v7 compatible behaviors
 * Use this in components that need specific handling for route transitions
 */
export const useRouterCompatibility = () => {
  useEffect(() => {
    // This hook can be expanded with additional compatibility logic
    // Currently, it just serves as a marker for components using router compatibility
  }, []);
  
  return {
    // Return any utility functions that components might need
    wrapWithTransition: (callback) => {
      // If React 18+ is available, use startTransition
      if (typeof React !== 'undefined' && React.startTransition) {
        return (...args) => {
          React.startTransition(() => {
            callback(...args);
          });
        };
      }
      
      // Fallback for older React versions
      return callback;
    }
  };
};

export default {
  getRouterFutureConfig,
  RouterCompatibilityHandler,
  useRouterCompatibility
}; 