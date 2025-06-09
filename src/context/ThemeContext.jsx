import React, { createContext, useState, useEffect, useContext } from 'react';

// Define theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Create the theme context with default values
export const ThemeContext = createContext({
  theme: THEMES.LIGHT,
  toggleTheme: () => {},
  THEMES: THEMES
});

// Custom hook to use the theme context safely
export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Return default values if context is not available
  if (!context) {
    console.warn('useTheme() called outside of ThemeProvider - using defaults');
    return {
      theme: THEMES.LIGHT,
      toggleTheme: () => {},
      THEMES: THEMES
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // IMPORTANT: Wrap all initialization in try/catch to prevent errors
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || THEMES.LIGHT;
    } catch (e) {
      console.error('Error reading theme from localStorage:', e);
      return THEMES.LIGHT;
    }
  };

  // Initialize theme from localStorage or default to LIGHT
  const [theme, setTheme] = useState(getInitialTheme);

  // Function to check system preference safely
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
      
      if (!root) {
        console.error('Document root element not available');
        return;
      }
      
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
      try {
        document.documentElement.classList.remove('dark');
      } catch (innerError) {
        console.error('Failed to set fallback theme:', innerError);
      }
    }
  };

  // Handle theme change safely
  const toggleTheme = (newTheme) => {
    try {
      if (!newTheme || !THEMES[newTheme.toUpperCase()]) {
        console.error(`Invalid theme: ${newTheme}`);
        newTheme = THEMES.LIGHT; // Fallback to light theme
      }
      
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
      try {
        document.documentElement.classList.remove('dark');
      } catch (innerError) {
        console.error('Failed to set fallback theme:', innerError);
      }
    }
  }, [theme]);

  // Listen for system preference changes in auto mode
  useEffect(() => {
    if (theme === THEMES.AUTO) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme(THEMES.AUTO);
        
        // Use the correct method based on browser support
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
        } else if (mediaQuery.addListener) {
          // Fallback for older browsers
          mediaQuery.addListener(handleChange);
          return () => mediaQuery.removeListener(handleChange);
        }
      } catch (e) {
        console.error('Error setting up media query listener:', e);
      }
    }
    
    return () => {}; // Empty cleanup function as fallback
  }, [theme]);

  // Prepare the context value
  const contextValue = {
    theme, 
    toggleTheme, 
    THEMES
  };

  // Safely render the provider
  try {
    return (
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    );
  } catch (e) {
    console.error('Error rendering ThemeProvider:', e);
    // Return children without context as fallback
    return children;
  }
};

export default ThemeProvider; 