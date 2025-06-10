/* eslint-disable */
module.exports = {
  plans: {
    free: {
      id: 'free_plan',
      name: 'Free',
      price: 0,
      currency: 'gbp',
      type: 'free',
      features: [
        'Basic CV builder',
        'Standard templates',
        'PDF export',
        'No AI analysis'
      ]
    },
    premiumBundle: {
      id: process.env.STRIPE_PRICE_ENHANCED_CV_DOWNLOAD || 'price_1RTLEoKSDrkHMuUnAmL6Hzmk',
      name: 'Premium CV Bundle',
      price: 19.99,
      currency: 'gbp',
      type: 'one_time',
      features: [
        'One complete CV creation',
        'All analysis & feedback tools',
        'Skills gap identification',
        'Upskill course recommendations',
        'Premium templates',
        'One-time download/print'
      ]
    },
    payPerCV: {
      id: 'price_pay_per_cv',
      name: 'Pay-Per-CV',
      price: 4.99,
      currency: 'gbp',
      type: 'one_time',
      features: [
        'Optimized CV tailored to job spec',
        'Access to premium template designs',
        'ATS-friendly formatting',
        'High-quality PDF export'
      ]
    },
    monthly: {
      id: 'price_monthly_subscription',
      name: 'Monthly Subscription',
      price: 9.99,
      currency: 'gbp',
      type: 'recurring',
      interval: 'month',
      features: [
        'Everything in Pay-Per-CV',
        'Unlimited CV generations + downloads',
        'Unlimited job spec comparisons',
        'Cover letter builder',
        'Career progression insights + AI interview prep',
        'Priority customer support'
      ]
    },
    yearly: {
      id: 'price_yearly_subscription',
      name: 'Yearly Subscription',
      price: 79,
      currency: 'gbp',
      type: 'recurring',
      interval: 'year',
      features: [
        'Everything in Pay-Per-CV',
        'Unlimited CV generations + downloads',
        'Unlimited job spec comparisons',
        'Cover letter builder',
        'Career progression insights + AI interview prep',
        'Priority customer support',
        'Save 34% compared to monthly'
      ]
    }
  },
  addons: {
    linkedinReview: {
      id: 'price_linkedin_review',
      name: 'AI-Enhanced LinkedIn Review',
      price: 7.99,
      currency: 'gbp',
      type: 'one_time',
      description: 'AI-powered LinkedIn profile optimization'
    }
  }
}; 