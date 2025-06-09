/* eslint-disable */
import React, { useEffect } from 'react';
import { RouterCompatibilityHandler } from '../utils/routerConfig';
import { RouterDebugMonitor } from '../utils/routerDebug';

/**
 * Router Optimizer Component
 * This component applies various optimizations and compatibility fixes for React Router
 * It's a good practice to include this component once at the app root
 */
const RouterOptimizer = () => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[RouterOptimizer] Initialized - applying router optimizations');
    }
    
    // Apply any one-time router optimizations here
    // For example, we could patch any global router-related APIs
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  return (
    <>
      {/* Apply compatibility flags and suppress warnings */}
      <RouterCompatibilityHandler />
      
      {/* Only include the debug monitor in development */}
      {import.meta.env.DEV && <RouterDebugMonitor />}
    </>
  );
};

export default RouterOptimizer; 