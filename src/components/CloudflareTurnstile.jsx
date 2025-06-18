/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';

/**
 * Cloudflare Turnstile Component
 * 
 * This component integrates Cloudflare's Turnstile CAPTCHA service to verify users are human.
 * It's designed to be a drop-in replacement for reCAPTCHA with better privacy and performance.
 * 
 * Usage:
 * <CloudflareTurnstile
 *   siteKey="your-site-key"
 *   onVerify={(token) => console.log('Verified:', token)}
 *   onError={(error) => console.error('Error:', error)}
 *   onExpire={() => console.log('Token expired')}
 * />
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
      console.error('Failed to load Cloudflare Turnstile script');
      if (onError) onError('Failed to load Turnstile');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [onError]);

  // Initialize Turnstile widget when script is loaded
  useEffect(() => {
    if (!isLoaded || !turnstileRef.current || !siteKey || disabled) {
      return;
    }

    try {
      const id = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        theme: theme,
        size: size,
        callback: (token) => {
          console.log('Turnstile verification successful');
          if (onVerify) onVerify(token);
        },
        'error-callback': (error) => {
          console.error('Turnstile error:', error);
          if (onError) onError(error);
        },
        'expired-callback': () => {
          console.log('Turnstile token expired');
          if (onExpire) onExpire();
        }
      });
      
      setWidgetId(id);
    } catch (error) {
      console.error('Error rendering Turnstile:', error);
      if (onError) onError(error);
    }
  }, [isLoaded, siteKey, theme, size, onVerify, onError, onExpire, disabled]);

  // Reset function to manually reset the widget
  const reset = () => {
    if (widgetId !== null && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  };

  // Expose reset function via ref
  React.useImperativeHandle(turnstileRef, () => ({
    reset
  }));

  if (!siteKey) {
    return (
      <div className={`text-yellow-600 text-sm ${className}`}>
        ⚠️ Turnstile site key not configured
      </div>
    );
  }

  if (disabled) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        Security verification disabled
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
        <div className="text-gray-500 text-sm">
          Loading security verification...
        </div>
      )}
    </div>
  );
};

export default CloudflareTurnstile; 