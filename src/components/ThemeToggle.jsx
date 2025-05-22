import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme, THEMES } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          onClick={() => toggleTheme(THEMES.LIGHT)}
          className={`flex items-center p-2 rounded-md ${
            theme === THEMES.LIGHT 
              ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
          }`}
          aria-label="Light Mode"
          title="Light Mode"
        >
          <FiSun className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => toggleTheme(THEMES.DARK)}
          className={`flex items-center p-2 rounded-md ${
            theme === THEMES.DARK 
              ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
          }`}
          aria-label="Dark Mode"
          title="Dark Mode"
        >
          <FiMoon className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => toggleTheme(THEMES.AUTO)}
          className={`flex items-center p-2 rounded-md ${
            theme === THEMES.AUTO 
              ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
          }`}
          aria-label="Auto Mode (System Preference)"
          title="Auto Mode (System Preference)"
        >
          <FiMonitor className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle; 