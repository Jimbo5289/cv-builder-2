import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for frontend error monitoring
 */
export const initSentry = () => {
  // Only initialize in production or if explicitly enabled in development
  const isDev = import.meta.env.MODE === 'development';
  const enableDevSentry = import.meta.env.VITE_SENTRY_ENABLE_DEV === 'true';
  
  if (isDev && !enableDevSentry) {
    console.log('Sentry disabled in development mode');
    return;
  }

  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn('Sentry DSN not found. Error tracking will be disabled.');
    return;
  }

  try {
    Sentry.init({
      dsn: dsn,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || 'development',
      release: import.meta.env.VITE_SENTRY_RELEASE || `cv-builder@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
      
      // Sample rate for performance monitoring
      // We recommend adjusting this value in production
      tracesSampleRate: isDev ? 1.0 : 0.2,
      
      // Only send errors in production unless explicitly enabled
      enabled: !isDev || enableDevSentry,
      
      // Capture user context but not PII
      sendDefaultPii: false,
      
      // Configure which errors to capture
      ignoreErrors: [
        // Ignore network errors that are not actionable
        'Network request failed',
        'Failed to fetch',
        'Load failed',
        // Ignore errors from extensions/plugins
        /^Extension context/,
        // Ignore errors from third-party scripts
        /^Script error/,
      ],
      
      // Before sending an event to Sentry
      beforeSend(event, hint) {
        // Don't send events in development unless explicitly enabled
        if (isDev && !enableDevSentry) {
          return null;
        }
        
        // Filter out errors we don't want to track
        const error = hint?.originalException;
        if (error && typeof error === 'object') {
          // Don't track client-side validation errors
          if (error.name === 'ValidationError') {
            return null;
          }
          
          // Don't track auth-related errors (we handle these differently)
          if (error.message?.includes('authentication') || error.message?.includes('unauthorized')) {
            return null;
          }
        }
        
        // Anonymize user data before sending
        if (event.user) {
          // Only send user ID (never email or personal info)
          event.user = {
            id: event.user.id,
            // Remove any other user properties
          };
        }
        
        return event;
      }
    });
    
    console.log('Sentry initialized successfully');
  } catch (error) {
    console.error('Error initializing Sentry:', error);
  }
};

/**
 * Set user information in Sentry
 * @param {Object} user - User object with id
 */
export const setSentryUser = (user) => {
  if (!user) {
    Sentry.setUser(null);
    return;
  }
  
  Sentry.setUser({
    id: user.id,
    // Don't include email or other PII
  });
};

/**
 * Clear user information from Sentry
 */
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

/**
 * Add a breadcrumb to track user flow
 * @param {String} category - Category of the breadcrumb
 * @param {String} message - Message for the breadcrumb
 * @param {Object} data - Additional data (be careful not to include PII)
 */
export const addBreadcrumb = (category, message, data = {}) => {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: 'info',
  });
};

/**
 * Capture an exception in Sentry
 * @param {Error} error - Error object to capture
 * @param {Object} context - Additional context data
 */
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context
  });
};

export default {
  initSentry,
  setSentryUser,
  clearSentryUser,
  addBreadcrumb,
  captureException
}; 