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
      name: '30-Day Access Pass',
      price: 19.99,
      currency: 'gbp',
      type: 'one_time',
      features: [
        'Full access for 30 days',
        'All analysis & feedback tools',
        'Skills gap identification',
        'Upskill course recommendations',
        'All premium templates'
      ]
    },
    payPerCV: {
      id: 'price_pay_per_cv',
      name: 'Pay-Per-CV',
      price: 4.99,
      currency: 'gbp',
      type: 'one_time',
      features: [
        'Basic CV builder',
        'Basic ATS analysis & scoring',
        'Standard templates',
        'One CV download/print'
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
        'Unlimited CV generations',
        'Advanced AI analysis & feedback',
        'Skills gap identification',
        'Cover letter builder',
        'All premium templates',
        'Priority support'
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
        'Everything in Monthly Subscription',
        'Early access to new features',
        'Career progression insights & planning',
        'AI interview preparation tools',
        'LinkedIn profile optimization',
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