export const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Basic CV template',
      'Download as PDF',
      'Basic ATS check',
      '1 CV storage',
    ],
    buttonText: 'Get Started',
    priceId: null,
  },
  {
    name: 'Professional',
    price: 9.99,
    interval: 'month',
    features: [
      'All Free features',
      'Premium CV templates',
      'Advanced ATS optimization',
      'Unlimited CV storage',
      'Priority support',
    ],
    buttonText: 'Start Pro Plan',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 29.99,
    interval: 'month',
    features: [
      'All Professional features',
      'Custom branding',
      'Team collaboration',
      'API access',
      'Dedicated account manager',
    ],
    buttonText: 'Contact Sales',
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  },
]; 