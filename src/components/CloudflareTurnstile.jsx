/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';

/**
 * Cloudflare Turnstile Component
 * 
 * This component integrates Cloudflare's Turnstile CAPTCHA service to verify users are human.
 * It provides enterprise-grade bot protection with better privacy and performance than traditional CAPTCHAs.
 */
const CloudflareTurnstile = ({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'auto', // 'light', 'dark', 'auto'
  size = 'normal', // 'normal', 'compact'
  className = '',
  disabled = false
}) => {
  const turnstileRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [widgetId, setWidgetId] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Load Cloudflare Turnstile script
  useEffect(() => {
    // Check if script is already loaded
    if (window.turnstile) {
      setIsLoaded(true);
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      if (onError) onError('Security verification service unavailable. Please try again later.');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [onError]);

  // Initialize Turnstile widget when script is loaded
  useEffect(() => {
    if (!isLoaded || !turnstileRef.current || !siteKey || disabled) {
      return;
    }

    // Add small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        // Validate that window.turnstile exists and has render method
        if (!window.turnstile || typeof window.turnstile.render !== 'function') {
          if (onError) onError('Security verification service failed to initialize. Please refresh the page.');
          return;
        }

        const id = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          theme: theme,
          size: size,
          callback: (token) => {
            setIsVerifying(false);
            if (onVerify) onVerify(token);
          },
          'error-callback': (error) => {
            setIsVerifying(false);
            let errorMessage = 'Security verification failed. Please try again.';
            
            // Handle specific error cases
            if (error === 'expired') {
              errorMessage = 'Security verification expired. Please try again.';
            } else if (error === 'timeout') {
              errorMessage = 'Security verification timed out. Please try again.';
            } else if (error === 'invalid-input-secret') {
              errorMessage = 'Security verification configuration error. Please contact support.';
            }
            
            if (onError) onError(errorMessage);
          },
          'expired-callback': () => {
            setIsVerifying(false);
            if (onExpire) onExpire();
          },
          'before-interactive-callback': () => {
            setIsVerifying(true);
          }
        });
        
        setWidgetId(id);
      } catch (error) {
        setIsVerifying(false);
        console.error('Turnstile render error:', error);
        if (onError) onError('Security verification temporarily unavailable. Please try again in a moment.');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoaded, siteKey, theme, size, onVerify, onError, onExpire, disabled]);

  // Reset function to manually reset the widget
  const reset = () => {
    if (widgetId !== null && window.turnstile) {
      window.turnstile.reset(widgetId);
      setIsVerifying(false);
    }
  };

  // Expose reset function via ref
  React.useImperativeHandle(turnstileRef, () => ({
    reset
  }));

  if (!siteKey) {
    return (
      <div className={`border border-yellow-200 bg-yellow-50 rounded-md p-3 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Security verification is temporarily unavailable.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className={`border border-gray-200 bg-gray-50 rounded-md p-3 ${className}`}>
        <div className="text-center">
          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            Security verification is currently disabled
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div 
        ref={turnstileRef}
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme={theme}
        data-size={size}
      />
      {!isLoaded && (
        <div className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-gray-600">Loading security verification...</span>
        </div>
      )}
      {isVerifying && (
        <div className="flex items-center justify-center p-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-blue-600">Verifying...</span>
        </div>
      )}
    </div>
  );
};

export default CloudflareTurnstile; 