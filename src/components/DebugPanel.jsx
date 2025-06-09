/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { getRouterDebugInfo } from '../utils/routerDebug';
import { getRouterFutureConfig } from '../utils/routerConfig';
import { useServer } from '../context/ServerContext';
import { validateProject } from '../utils/projectValidator';

/**
 * A styled debug panel for development purposes
 * This matches the aesthetic of the CV Builder application
 */
const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('react');
  const [validationResults, setValidationResults] = useState(null);
  const { serverUrl, isConnected, status } = useServer();
  
  const togglePanel = () => setIsOpen(!isOpen);
  
  // Get debug information
  const routerDebugInfo = getRouterDebugInfo();
  const routerConfig = getRouterFutureConfig();
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Use useEffect unconditionally to comply with React Hooks rules
  useEffect(() => {
    // Only run validation in development mode
    if (import.meta.env.DEV) {
      try {
        const results = validateProject();
        setValidationResults(results);
      } catch (error) {
        console.error('Error running project validation:', error);
        setValidationResults({
          error: true,
          message: error.message
        });
      }
    }
  }, []);

  // Only render in development mode
  if (!import.meta.env.DEV) return null;

  // If panel is closed, just show the toggle button
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={togglePanel}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          title="Toggle Debug Panel"
        >
          <span className="sr-only">Open Debug Panel</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    );
  }

  // Display the full debug panel
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Debug Panel</h2>
        <button
          onClick={togglePanel}
          className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'react' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
            onClick={() => handleTabChange('react')}
          >
            React
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'router' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
            onClick={() => handleTabChange('router')}
          >
            Router
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'server' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
            onClick={() => handleTabChange('server')}
          >
            Server
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'validation' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'}`}
            onClick={() => handleTabChange('validation')}
          >
            Validation
          </button>
        </nav>
      </div>
      
      <div className="p-4 max-h-96 overflow-auto text-sm">
        {activeTab === 'react' && (
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">React Debug Info</h3>
            <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs whitespace-pre-wrap">
              {JSON.stringify({
                mode: import.meta.env.MODE,
                dev: import.meta.env.DEV,
                prod: import.meta.env.PROD
              }, null, 2)}
            </pre>
          </div>
        )}
        
        {activeTab === 'router' && (
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Router Debug Info</h3>
            <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs whitespace-pre-wrap">
              {JSON.stringify(routerDebugInfo, null, 2)}
            </pre>
            <h4 className="font-medium text-gray-800 dark:text-white mt-4 mb-2">Router Config</h4>
            <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs whitespace-pre-wrap">
              {JSON.stringify(routerConfig, null, 2)}
            </pre>
          </div>
        )}
        
        {activeTab === 'server' && (
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Server Status</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                <span className="font-medium">URL:</span> {serverUrl}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                <span className="font-medium">Connected:</span> {isConnected ? '✅' : '❌'}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded col-span-2">
                <span className="font-medium">Status:</span> {status}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'validation' && (
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Project Validation</h3>
            {validationResults ? (
              <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs whitespace-pre-wrap">
                {JSON.stringify(validationResults, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Validation not run yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPanel; 