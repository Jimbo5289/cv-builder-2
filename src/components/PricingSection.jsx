import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PricingSection() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const pricingPlans = [
    {
      name: 'Pay-Per-CV',
      price: 4.99,
      interval: 'one-time',
      features: [
        'Optimized CV tailored to job spec',
        'Access to premium template designs',
        'ATS-friendly formatting',
        'High-quality PDF export'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Monthly Subscription',
      price: 9.99,
      interval: 'month',
      features: [
        'Everything in Pay-Per-CV',
        'Unlimited CV generations + downloads',
        'Unlimited job spec comparisons',
        'Cover letter builder',
        'Career progression insights + AI interview prep',
        'Priority customer support'
      ],
      buttonText: 'Subscribe Now',
      popular: true
    },
    {
      name: 'Yearly Subscription',
      price: 79,
      interval: 'year',
      features: [
        'Everything in Monthly Subscription',
        'Save 34% compared to monthly',
        'Priority feature requests',
        'Early access to new templates'
      ],
      buttonText: 'Save 34%',
      popular: false
    }
  ];

  const addons = [
    {
      name: 'Custom Branding',
      price: 49,
      description: 'Custom branding setup for agencies',
      buttonText: 'Add to Plan'
    },
    {
      name: 'AI-Enhanced LinkedIn Review',
      price: 7.99,
      description: 'AI-powered LinkedIn profile optimization',
      buttonText: 'Add to Plan'
    }
  ];

  const handleSubscribe = async (plan) => {
    if (!user) {
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    try {
      setLoading(true);
      setSelectedPlan(plan);

      // Create checkout session
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-[#E78F81] transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-[#E78F81] text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£{plan.price}</span>
                  {plan.interval && (
                    <span className="text-gray-500">/{plan.interval}</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading && selectedPlan === plan}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-[#E78F81] hover:bg-[#d36e62]'
                      : 'bg-[#2c3e50] hover:bg-[#1a2530]'
                  } ${(loading && selectedPlan === plan) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {(loading && selectedPlan === plan) ? 'Processing...' : plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Optional Add-ons</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{addon.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£{addon.price}</span>
                  <span className="text-gray-500"> one-time</span>
                </div>
                <p className="text-gray-600 mb-8">{addon.description}</p>
                <button
                  onClick={() => handleSubscribe(addon)}
                  disabled={loading && selectedPlan === addon}
                  className="w-full py-3 px-4 bg-[#2c3e50] text-white rounded-md hover:bg-[#1a2530] transition-colors duration-200"
                >
                  {(loading && selectedPlan === addon) ? 'Processing...' : addon.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 