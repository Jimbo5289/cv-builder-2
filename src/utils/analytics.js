import * as Sentry from '@sentry/react';

// Placeholder for Firebase Analytics
const trackEvent = (eventName, properties = {}) => {
  console.log('Analytics Event:', eventName, properties);
};

const trackPageView = (path) => {
  console.log('Page View:', path);
  
  // Add breadcrumb to Sentry
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Page view: ${path}`,
    level: 'info',
    data: {
      path,
      title: document.title,
      url: window.location.href
    }
  });
};

const trackUserAction = (action, properties = {}) => {
  console.log('User Action:', action, properties);
  
  // Add breadcrumb to Sentry
  Sentry.addBreadcrumb({
    category: 'user_action',
    message: action,
    level: 'info',
    data: properties
  });
};

const trackError = (error, properties = {}) => {
  // Send to Sentry
  Sentry.captureException(error, {
    extra: properties
  });
};

const trackPerformance = (metric) => {
  console.log('Performance Metric:', metric);
  
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
    form_name: formName,
    action,
    ...properties
  });
};

/**
 * Track API calls
 * @param {string} endpoint - The API endpoint
 * @param {string} method - The HTTP method
 * @param {number} duration - The request duration in milliseconds
 * @param {boolean} success - Whether the request was successful
 * @param {Object} properties - Additional properties
 */
export const trackApiCall = (endpoint, method, duration, success, properties = {}) => {
  trackEvent('api_call', {
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
 * Track user session
 * @param {Object} properties - Session properties
 */
export const trackSession = (properties = {}) => {
  const sessionId = generateSessionId();
  
  trackEvent('session', {
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

export {
  trackEvent,
  trackPageView,
  trackUserAction,
  trackError,
  trackPerformance
}; 