import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PricingSection() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is upgrading from a premium feature
  const isPremiumUpgrade = location.state?.premium;
  const premiumFeature = location.state?.feature || 'this feature';
  const fromPath = location.state?.from || '';

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

      // Try all potential ports for the API
      const fallbackPorts = [3005, 3006, 3007, 3008, 3009];
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005';
      let result = null;
      
      // First try the main API URL
      result = await tryCreateCheckoutSession(`${apiUrl}/api/checkout/create-session`, plan);
      
      // If main API URL fails, try fallback ports
      if (!result?.success) {
        for (const port of fallbackPorts) {
          const fallbackUrl = `http://localhost:${port}`;
          if (fallbackUrl !== apiUrl) { // Skip if already tried with this URL
            result = await tryCreateCheckoutSession(`${fallbackUrl}/api/checkout/create-session`, plan);
            if (result?.success) break;
          }
        }
      }
      
      if (!result?.success) {
        const errorMessage = result?.error || 'Failed to connect to server. Please try again later.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(`Subscription error: ${error.message || 'An unknown error occurred'}`);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };
  
  const tryCreateCheckoutSession = async (checkoutUrl, plan) => {
    try {
      // Determine if we have a price ID or need to use the plan interval
      const planData = plan.priceId 
        ? { priceId: plan.priceId } 
        : { planInterval: plan.interval === 'month' ? 'monthly' : 'annual' };

      console.log('Sending checkout request with data:', planData);
        
      const response = await fetch(checkoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...planData,
          userId: user.id
        }),
      });

      let errorText = '';
      try {
        const errorData = await response.json();
        if (!response.ok) {
          console.error('Checkout error response:', errorData);
          errorText = errorData.error || 'Unknown error occurred';
          return {success: false, error: errorText};
        }
        
        console.log('Checkout response:', errorData);
        
        // Handle mock session in development 
        if (errorData.data?.url && errorData.data.url.includes('mock=true')) {
          window.location.href = errorData.data.url;
          return {success: true};
        }
        
        // Otherwise proceed with Stripe checkout
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: errorData.data.sessionId,
        });

        if (error) {
          console.error('Stripe error:', error);
          return {success: false, error: error.message};
        }
        
        return {success: true};
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        return {success: false, error: 'Failed to parse server response'};
      }
    } catch (error) {
      console.error(`Checkout error at ${checkoutUrl}:`, error);
      return {success: false, error: error.message};
    }
  };

  return (
    <div className="bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Simple, Transparent Pricing</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">Choose the plan that's right for you</p>
        </div>

        {/* Premium Feature Notice */}
        {isPremiumUpgrade && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 max-w-3xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Premium Feature Access</span> - Subscribe to a plan below to unlock {premiumFeature} and all other premium features.
                </p>
                {fromPath && (
                  <p className="mt-2">
                    <button 
                      onClick={() => navigate(fromPath)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Return to previous page
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300
                ${plan.popular ? 'ring-2 ring-[#E78F81] md:transform md:scale-105 z-10' : ''}
                ${index === 1 && !plan.popular ? 'my-4 md:my-0' : ''}
              `}
            >
              {plan.popular && (
                <div className="bg-[#E78F81] text-white text-center py-1 sm:py-2 text-xs sm:text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-4 sm:p-6 md:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">{plan.name}</h3>
                <div className="mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold">£{plan.price}</span>
                  {plan.interval && (
                    <span className="text-gray-500 text-sm sm:text-base">/{plan.interval}</span>
                  )}
                </div>
                <ul className="space-y-2 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm sm:text-base text-gray-600">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading && selectedPlan === plan}
                  className={`w-full py-2 sm:py-3 px-4 rounded-md text-white text-sm sm:text-base font-medium transition-colors duration-200 ${
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

        {/* Add-ons Section */}
        <div className="mt-12 sm:mt-14 md:mt-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Optional Add-ons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">{addon.name}</h3>
                <div className="mb-3 sm:mb-4 md:mb-6">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold">£{addon.price}</span>
                  <span className="text-gray-500 text-sm sm:text-base"> one-time</span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 md:mb-8">{addon.description}</p>
                <button
                  onClick={() => handleSubscribe(addon)}
                  disabled={loading && selectedPlan === addon}
                  className="w-full py-2 sm:py-3 px-4 bg-[#2c3e50] text-white text-sm sm:text-base rounded-md hover:bg-[#1a2530] transition-colors duration-200"
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