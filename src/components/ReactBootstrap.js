import React, { useEffect } from 'react';

/**
 * ReactBootstrap
 * 
 * This component ensures that React and related globals are properly defined
 * throughout the application to avoid ESLint errors and runtime issues.
 * 
 * Add this component near the root of your application.
 */
const ReactBootstrap = ({ children }) => {
  // Ensure React globals are defined
  useEffect(() => {
    // Define React globals for older components that expect them
    if (typeof window !== 'undefined') {
      // Ensure React is defined globally
      window.React = window.React || React;
      
      // Make React hooks available globally for legacy components
      if (window.React) {
        window.useState = React.useState;
        window.useEffect = React.useEffect;
        window.useContext = React.useContext;
        window.useCallback = React.useCallback;
        window.useMemo = React.useMemo;
        window.useRef = React.useRef;
        window.useReducer = React.useReducer;
      }
      
      // Log React initialization for debugging
      console.log('[ReactBootstrap] React globals initialized');
    }
  }, []);

  return children;
};

export default ReactBootstrap; 