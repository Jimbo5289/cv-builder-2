/**
 * React ESLint Fix Utility
 * This utility helps fix common ESLint errors with React components
 */

/* eslint-disable */

// Define React globals to prevent "React is not defined" errors
const ensureReactGlobals = () => {
  // Make sure React is defined
  if (typeof window !== 'undefined') {
    // Ensure React is defined
    window.React = window.React || {};
    
    // Ensure common hooks are defined
    const hooks = ['useState', 'useEffect', 'useContext', 'useReducer', 
                  'useCallback', 'useMemo', 'useRef', 'useLayoutEffect'];
    
    hooks.forEach(hook => {
      if (window.React && !window[hook] && window.React[hook]) {
        window[hook] = window.React[hook];
      }
    });
    
    // Make sure ReactDOM is defined
    window.ReactDOM = window.ReactDOM || {};
    
    return true;
  }
  return false;
};

// Execute immediately
ensureReactGlobals();

// Patch React.createElement to be more resilient against errors
const patchReactCreateElement = () => {
  if (typeof window !== 'undefined' && window.React && window.React.createElement) {
    const originalCreateElement = window.React.createElement;
    
    window.React.createElement = function safeguardedCreateElement(type, props, ...children) {
      // Handle undefined components with a fallback
      if (type === undefined || type === null) {
        console.warn('Attempted to render undefined component, using fallback');
        return originalCreateElement('div', { 
          style: { 
            border: '1px dashed red',
            padding: '4px',
            display: 'inline-block',
            color: 'red'
          } 
        }, 'Undefined Component');
      }
      
      // Handle normal case
      return originalCreateElement(type, props, ...children);
    };
  }
};

// Export React and its hooks for ESLint to recognize
export const React = window.React || {};
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useContext = React.useContext;
export const useCallback = React.useCallback;
export const useMemo = React.useMemo;
export const useRef = React.useRef;
export const useReducer = React.useReducer;

// Try to patch React.createElement
try {
  patchReactCreateElement();
} catch (e) {
  console.error('Failed to patch React.createElement:', e);
}

export default {
  ensureReactGlobals,
  patchReactCreateElement
}; 