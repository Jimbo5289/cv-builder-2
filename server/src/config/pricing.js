module.exports = {
  plans: {
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
    customBranding: {
      id: 'price_custom_branding',
      name: 'Custom Branding',
      price: 49,
      currency: 'gbp',
      type: 'one_time',
      description: 'Custom branding setup for agencies'
    },
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