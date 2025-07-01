import { trackEvent, trackConversion, trackUserAction } from './analytics';

/**
 * CV Builder Specific Analytics Tracking
 * This module tracks business-critical events for the CV Builder platform
 */

/**
 * Track CV upload events
 * @param {Object} cvData - CV metadata (anonymized)
 */
export const trackCVUpload = (cvData = {}) => {
  trackEvent('cv_upload', {
    event_category: 'cv_builder',
    event_label: 'cv_uploaded',
    file_type: cvData.fileType || 'unknown',
    file_size_kb: cvData.fileSizeKB || 0,
    page_count: cvData.pageCount || 0,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track CV analysis requests
 * @param {Object} analysisData - Analysis metadata
 */
export const trackCVAnalysis = (analysisData = {}) => {
  trackEvent('cv_analysis_started', {
    event_category: 'cv_builder',
    event_label: 'analysis_requested',
    analysis_type: analysisData.type || 'standard',
    role: analysisData.role || '',
    industry: analysisData.industry || '',
    cv_length_words: analysisData.wordCount || 0,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track CV analysis completion
 * @param {Object} results - Analysis results
 */
export const trackCVAnalysisComplete = (results = {}) => {
  trackEvent('cv_analysis_completed', {
    event_category: 'cv_builder',
    event_label: 'analysis_completed',
    cv_score: results.score || 0,
    analysis_duration_seconds: results.durationSeconds || 0,
    improvements_count: results.improvementsCount || 0,
    missing_keywords_count: results.missingKeywordsCount || 0,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track subscription events
 * @param {string} eventType - Type of subscription event
 * @param {Object} subscriptionData - Subscription details
 */
export const trackSubscriptionEvent = (eventType, subscriptionData = {}) => {
  const eventMap = {
    'subscription_started': 'User started subscription process',
    'subscription_completed': 'User completed subscription',
    'subscription_cancelled': 'User cancelled subscription',
    'subscription_upgraded': 'User upgraded subscription',
    'subscription_downgraded': 'User downgraded subscription'
  };

  trackConversion(eventType, {
    subscription_type: subscriptionData.type || 'premium',
    plan: subscriptionData.plan || 'monthly',
    value: subscriptionData.value || 9.99,
    currency: 'GBP',
    trial_days: subscriptionData.trialDays || 0,
    previous_plan: subscriptionData.previousPlan || null,
    timestamp: new Date().toISOString()
  });

  // Track as user action for engagement analysis
  trackUserAction(eventType, {
    action_description: eventMap[eventType] || eventType,
    subscription_journey_step: subscriptionData.journeyStep || 'unknown',
    source: subscriptionData.source || 'direct'
  });
};

/**
 * Track user engagement with CV recommendations
 * @param {Object} engagementData - Engagement details
 */
export const trackRecommendationEngagement = (engagementData = {}) => {
  trackEvent('recommendation_engagement', {
    event_category: 'cv_builder',
    event_label: 'recommendation_viewed',
    recommendation_type: engagementData.type || 'improvement',
    recommendation_category: engagementData.category || 'general',
    action_taken: engagementData.action || 'viewed', // viewed, copied, applied, dismissed
    recommendation_score: engagementData.score || 0,
    time_spent_seconds: engagementData.timeSpent || 0,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track template usage
 * @param {Object} templateData - Template usage data
 */
export const trackTemplateUsage = (templateData = {}) => {
  trackEvent('template_usage', {
    event_category: 'cv_builder',
    event_label: 'template_selected',
    template_name: templateData.name || 'unknown',
    template_category: templateData.category || 'professional',
    user_type: templateData.userType || 'free',
    customization_level: templateData.customizationLevel || 'basic',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track user journey milestones
 * @param {string} milestone - Journey milestone name
 * @param {Object} milestoneData - Additional milestone data
 */
export const trackUserJourney = (milestone, milestoneData = {}) => {
  const milestones = {
    'landing_page_visit': 'User visited landing page',
    'cv_upload_started': 'User started CV upload process',
    'first_analysis_complete': 'User completed first CV analysis',
    'recommendations_viewed': 'User viewed CV recommendations',
    'subscription_page_visit': 'User visited subscription page',
    'account_created': 'User created account',
    'premium_feature_used': 'User used premium feature',
    'cv_downloaded': 'User downloaded improved CV',
    'return_visit': 'User returned to platform'
  };

  trackEvent('user_journey', {
    event_category: 'user_experience',
    event_label: milestone,
    milestone_description: milestones[milestone] || milestone,
    user_type: milestoneData.userType || 'anonymous',
    session_duration_minutes: milestoneData.sessionDuration || 0,
    previous_milestone: milestoneData.previousMilestone || null,
    days_since_signup: milestoneData.daysSinceSignup || 0,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track feature usage for product insights
 * @param {string} feature - Feature name
 * @param {Object} usageData - Feature usage data
 */
export const trackFeatureUsage = (feature, usageData = {}) => {
  trackEvent('feature_usage', {
    event_category: 'product_analytics',
    event_label: feature,
    feature_type: usageData.type || 'core', // core, premium, experimental
    usage_context: usageData.context || 'main_flow',
    success: usageData.success !== false, // default to true
    error_type: usageData.errorType || null,
    completion_time_seconds: usageData.completionTime || 0,
    user_type: usageData.userType || 'free',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track business conversion funnel
 * @param {string} funnelStep - Funnel step name
 * @param {Object} funnelData - Funnel data
 */
export const trackConversionFunnel = (funnelStep, funnelData = {}) => {
  const funnelSteps = {
    'awareness': 'User became aware of service',
    'interest': 'User showed interest (engaged with content)',
    'consideration': 'User considering service (uploaded CV)',
    'intent': 'User showed purchase intent (viewed pricing)',
    'evaluation': 'User evaluating service (used analysis)',
    'purchase': 'User made purchase decision',
    'retention': 'User returned and used service again'
  };

  trackEvent('conversion_funnel', {
    event_category: 'business_metrics',
    event_label: funnelStep,
    funnel_description: funnelSteps[funnelStep] || funnelStep,
    traffic_source: funnelData.source || 'direct',
    campaign: funnelData.campaign || null,
    referrer: funnelData.referrer || null,
    conversion_value: funnelData.value || 0,
    time_to_conversion_hours: funnelData.timeToConversion || 0,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track performance and user experience metrics
 * @param {Object} performanceData - Performance metrics
 */
export const trackPerformanceMetrics = (performanceData = {}) => {
  trackEvent('performance_metrics', {
    event_category: 'user_experience',
    event_label: 'performance_measured',
    page_load_time_ms: performanceData.pageLoadTime || 0,
    api_response_time_ms: performanceData.apiResponseTime || 0,
    cv_analysis_time_ms: performanceData.analysisTime || 0,
    error_rate: performanceData.errorRate || 0,
    user_satisfaction_score: performanceData.satisfactionScore || null,
    device_type: performanceData.deviceType || 'unknown',
    connection_type: performanceData.connectionType || 'unknown',
    timestamp: new Date().toISOString()
  });
};

/**
 * Set up automatic tracking for common CV Builder events
 */
export const initializeCVBuilderTracking = () => {
  // Track session start
  trackUserJourney('landing_page_visit', {
    userType: 'anonymous',
    sessionDuration: 0
  });

  // Track page visibility changes for engagement
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackEvent('page_hidden', {
        event_category: 'engagement',
        time_on_page: Date.now() - (window.pageStartTime || Date.now())
      });
    }
  });

  // Track scroll depth for engagement
  let maxScrollDepth = 0;
  window.addEventListener('scroll', () => {
    const scrollDepth = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackEvent('scroll_depth', {
          event_category: 'engagement',
          scroll_depth_percentage: scrollDepth
        });
      }
    }
  });

  // Set page start time for duration calculations
  window.pageStartTime = Date.now();

  console.log('CV Builder analytics tracking initialized');
}; 