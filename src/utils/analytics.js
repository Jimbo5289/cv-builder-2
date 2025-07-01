import * as Sentry from '@sentry/react';

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-G64RBEW6YP';

// Enhanced gtag initialization with fallback
const initializeGtag = () => {
  if (typeof window === 'undefined') return false;
  
  // Check if gtag script is already loaded
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
  
  if (!existingScript && GA_MEASUREMENT_ID) {
    // Load the gtag script dynamically
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    console.log('gtag script loaded dynamically');
  }
  
  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function() {
    window.dataLayer.push(arguments);
  };
  
  // Configure Google Analytics
  if (GA_MEASUREMENT_ID) {
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: 'SameSite=None;Secure'
    });
    console.log('GA configured with ID:', GA_MEASUREMENT_ID);
  }
  
  return true;
};

// Initialize gtag immediately when this module loads
initializeGtag();

/**
 * Wait for gtag to be available (with timeout)
 */
const waitForGtag = (timeout = 5000) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    if (window.gtag) {
      resolve(true);
      return;
    }
    
    let attempts = 0;
    const maxAttempts = timeout / 100;
    
    const checkGtag = () => {
      attempts++;
      if (window.gtag) {
        console.log('gtag became available after', attempts * 100, 'ms');
        resolve(true);
      } else if (attempts >= maxAttempts) {
        console.warn('gtag not available after', timeout, 'ms');
        resolve(false);
      } else {
        setTimeout(checkGtag, 100);
      }
    };
    
    checkGtag();
  });
};

/**
 * Track custom events in Google Analytics
 * @param {string} eventName - Event name
 * @param {Object} properties - Event properties
 */
const trackEvent = async (eventName, properties = {}) => {
  console.log('Analytics Event:', eventName, properties);
  
  // Wait for gtag to be available
  const gtagAvailable = await waitForGtag(2000);
  
  // Send to Google Analytics if available
  if (gtagAvailable && GA_MEASUREMENT_ID) {
    try {
      window.gtag('event', eventName, {
        custom_parameter_1: properties.category || 'general',
        custom_parameter_2: properties.label || '',
        value: properties.value || 0,
        ...properties
      });
      console.log('Event sent to GA:', eventName);
    } catch (error) {
      console.error('Error sending event to GA:', error);
    }
  } else {
    console.warn('gtag not available, event not sent:', eventName);
  }
  
  // Send to Sentry for debugging
  try {
    Sentry.addBreadcrumb({
      category: 'analytics',
      message: `Event: ${eventName}`,
      level: 'info',
      data: properties
    });
  } catch (error) {
    console.error('Error sending to Sentry:', error);
  }
};

/**
 * Track page views in Google Analytics
 * @param {string} path - Page path
 * @param {string} title - Page title
 */
const trackPageView = async (path, title = document.title) => {
  console.log('Page View:', path, title);
  
  // Wait for gtag to be available
  const gtagAvailable = await waitForGtag(2000);
  
  // Send to Google Analytics if available
  if (gtagAvailable && GA_MEASUREMENT_ID) {
    try {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title,
        page_location: window.location.href
      });
      
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: path
      });
      
      console.log('Page view sent to GA:', path);
    } catch (error) {
      console.error('Error sending page view to GA:', error);
    }
  } else {
    console.warn('gtag not available, page view not sent:', path);
  }
  
  // Add breadcrumb to Sentry
  try {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page view: ${path}`,
      level: 'info',
      data: {
        path,
        title,
        url: window.location.href
      }
    });
  } catch (error) {
    console.error('Error sending to Sentry:', error);
  }
};

/**
 * Track user actions and interactions
 * @param {string} action - Action name
 * @param {Object} properties - Action properties
 */
const trackUserAction = (action, properties = {}) => {
  console.log('User Action:', action, properties);
  
  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: 'user_interaction',
      event_label: properties.label || '',
      value: properties.value || 0,
      ...properties
    });
  }
  
  // Add breadcrumb to Sentry
  Sentry.addBreadcrumb({
    category: 'user_action',
    message: action,
    level: 'info',
    data: properties
  });
};

/**
 * Track errors and exceptions
 * @param {Error} error - Error object
 * @param {Object} properties - Additional properties
 */
const trackError = (error, properties = {}) => {
  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: properties.fatal || false,
      error_name: error.name,
      ...properties
    });
  }
  
  // Send to Sentry
  Sentry.captureException(error, {
    extra: properties
  });
};

/**
 * Track performance metrics
 * @param {Object} metric - Performance metric object
 */
const trackPerformance = (metric) => {
  console.log('Performance Metric:', metric);
  
  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'timing_complete', {
      name: metric.type,
      value: Math.round(metric.duration),
      event_category: 'performance',
      event_label: metric.details?.url || 'unknown'
    });
  }
  
  // Add breadcrumb to Sentry
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `Performance metric: ${metric.type}`,
    level: 'info',
    data: metric
  });
};

/**
 * Track form interactions
 * @param {string} formName - The form name
 * @param {string} action - The form action (submit, change, etc.)
 * @param {Object} properties - Additional properties
 */
export const trackFormInteraction = (formName, action, properties = {}) => {
  trackEvent('form_interaction', {
    event_category: 'forms',
    event_label: formName,
    form_name: formName,
    action,
    ...properties
  });
};

/**
 * Track conversion events (e.g., registration, subscription)
 * @param {string} conversionType - Type of conversion
 * @param {Object} properties - Conversion properties
 */
export const trackConversion = (conversionType, properties = {}) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      event_category: 'conversions',
      event_label: conversionType,
      value: properties.value || 0,
      currency: properties.currency || 'GBP',
      ...properties
    });
  }
  
  trackEvent('conversion', {
    conversion_type: conversionType,
    ...properties
  });
};

/**
 * Track API calls for performance monitoring
 * @param {string} endpoint - The API endpoint
 * @param {string} method - The HTTP method
 * @param {number} duration - The request duration in milliseconds
 * @param {boolean} success - Whether the request was successful
 * @param {Object} properties - Additional properties
 */
export const trackApiCall = (endpoint, method, duration, success, properties = {}) => {
  trackEvent('api_call', {
    event_category: 'api',
    event_label: `${method} ${endpoint}`,
    endpoint,
    method,
    duration,
    success,
    ...properties
  });

  // Track performance in Sentry
  if (!success) {
    Sentry.addBreadcrumb({
      category: 'api',
      message: `API call failed: ${method} ${endpoint}`,
      level: 'error',
      data: {
        endpoint,
        method,
        duration,
        ...properties
      }
    });
  }
};

/**
 * Track user session start
 * @param {Object} properties - Session properties
 */
export const trackSession = (properties = {}) => {
  const sessionId = generateSessionId();
  
  trackEvent('session_start', {
    event_category: 'engagement',
    session_id: sessionId,
    start_time: new Date().toISOString(),
    ...properties
  });

  // Set Sentry user context
  Sentry.setUser({
    id: sessionId,
    ...properties
  });
};

/**
 * Generate a unique session ID
 * @returns {string} Session ID
 */
const generateSessionId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Track subscription events
 * @param {string} eventType - Type of subscription event (started, completed, cancelled)
 * @param {Object} details - Subscription details
 */
export const trackSubscription = (eventType, details = {}) => {
  trackConversion('subscription_' + eventType, {
    subscription_type: details.type || 'premium',
    plan: details.plan || 'monthly',
    value: details.value || 9.99,
    currency: 'GBP',
    ...details
  });
};

export {
  trackEvent,
  trackPageView,
  trackUserAction,
  trackError,
  trackPerformance
}; 