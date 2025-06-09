# React Router Optimization Guide

This guide explains the React Router optimizations and future compatibility features implemented in the CV Builder application.

## Overview

We've implemented several features to ensure compatibility with React Router v7 and eliminate common warnings:

1. **Future Flags Configuration**: Enables v7 behavior ahead of time
2. **RouterOptimizer Component**: Central place to apply router-related fixes
3. **Router Debug Utilities**: Tools to diagnose and monitor router issues
4. **Development Debug Panel**: Interactive UI for examining router status

## Key Components

### 1. Router Configuration (`src/utils/routerConfig.js`)

This utility provides configuration for React Router future flags:

```jsx
import { useEffect } from 'react';

// Configure React Router future flags
export const getRouterFutureConfig = () => {
  return {
    v7_startTransition: true,        // Use React.startTransition for state updates
    v7_relativeSplatPath: true       // Use v7 behavior for relative splat paths
  };
};

// Component that handles React Router warnings
export const RouterCompatibilityHandler = () => {
  // Applies compatibility settings and suppresses warnings
  // ...
};
```

### 2. Router Optimizer (`src/components/RouterOptimizer.jsx`)

Central component that applies all router optimizations:

```jsx
import React from 'react';
import { RouterCompatibilityHandler } from '../utils/routerConfig';
import { RouterDebugMonitor } from '../utils/routerDebug';

const RouterOptimizer = () => {
  return (
    <>
      {/* Apply compatibility flags and suppress warnings */}
      <RouterCompatibilityHandler />
      
      {/* Only include the debug monitor in development */}
      {import.meta.env.DEV && <RouterDebugMonitor />}
    </>
  );
};
```

### 3. Future Flags in BrowserRouter (`src/main.jsx`)

The main application entry point applies future flags to BrowserRouter:

```jsx
import { getRouterFutureConfig } from './utils/routerConfig';

// Get the future flags configuration for React Router
const routerFutureConfig = getRouterFutureConfig();

// Apply flags to BrowserRouter
root.render(
  <BrowserRouter future={routerFutureConfig}>
    <App />
  </BrowserRouter>
);
```

## Common Issues Fixed

### 1. React Router Future Flag Warnings

- **Issue**: "React Router Future Flag Warning: React Router will begin wrapping state updates in 'React.startTransition' in v7"
- **Solution**: Enable the `v7_startTransition` flag in BrowserRouter

### 2. Relative Route Resolution Warning

- **Issue**: "React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7"
- **Solution**: Enable the `v7_relativeSplatPath` flag in BrowserRouter

## Debugging Tools

### 1. Debug Panel (`src/components/DebugPanel.jsx`)

An interactive UI panel (only in development) that displays:
- React information
- Router status and warnings
- Enabled future flags

### 2. Router Debug Script (`scripts/debug-router.js`)

A CLI tool that checks for common React Router issues:

```bash
node scripts/debug-router.js
```

This will scan relevant files and report any configuration issues or missing optimizations.

## Best Practices

1. Always use the `RouterOptimizer` component in your app routes
2. Apply future flags using the `getRouterFutureConfig` utility
3. Use the debug panel in development to monitor router status
4. Run the debug script if you encounter router-related issues

## Further Reading

- [React Router v6 Documentation](https://reactrouter.com/en/main)
- [React Router v7 Migration Guide](https://reactrouter.com/en/main/upgrading/v7)
- [React 18 Transitions API](https://react.dev/reference/react/useTransition) 