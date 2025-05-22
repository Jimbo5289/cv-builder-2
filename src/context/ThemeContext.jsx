import React, { createContext, useState, useEffect, useContext } from 'react';

// Define theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Create the theme context
export const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to LIGHT (not AUTO) to prevent blank blue screen
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || THEMES.LIGHT;
    } catch (e) {
      console.error('Error reading theme from localStorage:', e);
      return THEMES.LIGHT;
    }
  });

  // Function to check system preference
  const getSystemTheme = () => {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? THEMES.DARK 
        : THEMES.LIGHT;
    } catch (e) {
      console.error('Error checking system theme preference:', e);
      return THEMES.LIGHT;
    }
  };

  // Function to apply theme changes to document
  const applyTheme = (newTheme) => {
    try {
      const root = window.document.documentElement;
      
      // Always remove dark class first to start from a clean state
      root.classList.remove('dark');
      
      if (newTheme === THEMES.AUTO) {
        // Auto mode - follow system preference
        if (getSystemTheme() === THEMES.DARK) {
          root.classList.add('dark');
        }
      } else if (newTheme === THEMES.DARK) {
        // Dark mode
        root.classList.add('dark');
      }
      // Light mode - dark class already removed
    } catch (e) {
      console.error('Error applying theme:', e);
      // Ensure light mode as fallback in case of error
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle theme change
  const toggleTheme = (newTheme) => {
    try {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  };

  // Apply initial theme
  useEffect(() => {
    try {
      applyTheme(theme);
    } catch (e) {
      console.error('Error in theme effect:', e);
      // Fallback to light mode
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen for system preference changes in auto mode
  useEffect(() => {
    if (theme === THEMES.AUTO) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme(THEMES.AUTO);
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } catch (e) {
        console.error('Error setting up media query listener:', e);
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 