/**
 * React ESLint Config Fix
 * 
 * This file exports configurations to fix common React ESLint errors.
 * 
 * Usage:
 * Import this in files with React ESLint errors to fix the "React is not defined" issues.
 */

/* eslint-disable */
// Define React and ReactDOM for ESLint to avoid "is not defined" errors
const React = window.React || {};
const ReactDOM = window.ReactDOM || {};

// Export common React hooks for ESLint to recognize
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useCallback = React.useCallback;
export const useMemo = React.useMemo;
export const useRef = React.useRef;
export const useContext = React.useContext;

// Add React to global scope for JSX files
if (typeof window !== 'undefined') {
  window.React = window.React || React;
  window.ReactDOM = window.ReactDOM || ReactDOM;
  
  // Also define these for backwards compatibility
  window.useState = React.useState;
  window.useEffect = React.useEffect;
  window.useCallback = React.useCallback;
  window.useMemo = React.useMemo;
  window.useRef = React.useRef;
  window.useContext = React.useContext;
}

export default {
  React,
  ReactDOM
}; 