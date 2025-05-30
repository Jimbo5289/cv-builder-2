import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Add a helper function for plan comparison and color-coding by value
const getBestValuePlan = () => {
  return 'Yearly Subscription'; // Best value for money
};

const getRecommendedPlan = () => {
  return 'Monthly Subscription'; // Best for single use
};

export default function PricingSection() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'comparison'
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is upgrading from a premium feature
  const isPremiumUpgrade = location.state?.premium;
  const premiumFeature = location.state?.feature || 'this feature';
  const fromPath = location.state?.from || '';
  const preselect = location.state?.preselect;

  // Handle preselection if coming from subscription modal
  useEffect(() => {
    if (preselect === 'premium-bundle') {
      // Find the Premium CV Bundle plan and scroll to it
      const bundlePlanElement = document.getElementById('premium-cv-bundle');
      if (bundlePlanElement) {
        bundlePlanElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        bundlePlanElement.classList.add('ring-4', 'ring-[#E78F81]', 'ring-opacity-50');
        setTimeout(() => {
          bundlePlanElement.classList.remove('ring-4', 'ring-[#E78F81]', 'ring-opacity-50');
        }, 2000);
      }
    } else if (preselect === 'subscription') {
      // Find the Monthly Subscription plan and scroll to it
      const subscriptionElement = document.getElementById('monthly-subscription');
      if (subscriptionElement) {
        subscriptionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        subscriptionElement.classList.add('ring-4', 'ring-[#E78F81]', 'ring-opacity-50');
        setTimeout(() => {
          subscriptionElement.classList.remove('ring-4', 'ring-[#E78F81]', 'ring-opacity-50');
        }, 2000);
      }
    }
  }, [preselect]);

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      interval: null,
      features: [
        'Basic CV builder',
        'Standard templates',
        'PDF export',
        'No AI analysis',
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Pay-Per-CV',
      price: 4.99,
      interval: 'one-time',
      priceId: 'price_pay_per_cv',
      features: [
        'Optimized CV tailored to job spec',
        'Access to premium template designs',
        'ATS-friendly formatting',
        'High-quality PDF export'
      ],
      description: 'Create and download a single optimized CV. Pay each time you need a new CV.',
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: '24-Hour Access Pass',
      price: 9.99,
      interval: 'one-time',
      priceId: 'price_24hour_access',
      features: [
        'Full access for 24 hours',
        'Advanced AI feedback & analysis',
        'Skills gap identification',
        'Personalized upskill recommendations',
        'All premium templates'
      ],
      description: 'Complete 24-hour access to all premium features - perfect for creating the perfect CV in one focused session',
      buttonText: 'Get 24-Hour Access',
      popular: false
    },
    {
      name: 'Monthly Subscription',
      price: 9.99,
      interval: 'month',
      priceId: 'price_monthly',
      features: [
        'Unlimited CV generations',
        'Advanced AI analysis & feedback',
        'Skills gap identification',
        'Cover letter builder',
        'All premium templates',
        'Priority support'
      ],
      description: 'Complete access to all premium features with unlimited CV creation and ongoing updates',
      buttonText: 'Subscribe Now',
      popular: true
    },
    {
      name: 'Yearly Subscription',
      price: 79,
      interval: 'year',
      priceId: 'price_annual',
      features: [
        'Everything in Monthly Subscription',
        'Early access to new features',
        'Career progression insights & planning',
        'AI interview preparation tools',
        'LinkedIn profile optimization',
        'Save 34% compared to monthly'
      ],
      description: 'Our best value plan with all premium features unlocked and exclusive career planning tools',
      buttonText: 'Save 34%',
      popular: false
    }
  ];

  const addons = [
    {
      name: 'AI-Enhanced LinkedIn Review',
      price: 7.99,
      description: 'AI-powered LinkedIn profile optimization',
      buttonText: 'Add to Plan'
    }
  ];

  const handleSubscribe = async (plan) => {
    // For free plan, redirect to dashboard or signup
    if (plan.name === 'Free') {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/signup?plan=free');
      }
      return;
    }

    // Special handling for Premium CV Bundle
    if (plan.name === '24-Hour Access Pass') {
      if (!user) {
        navigate('/signup?plan=premium-bundle');
        return;
      }
      
      // For Premium Bundle, we'll set up a one-time use flag after payment
      // Continue with checkout as normal
    }

    // Implementation note for Pay-Per-CV:
    // When a user purchases a Pay-Per-CV plan, create a downloadToken in the database
    // Track downloadCount for that specific CV
    // After the first download, set downloadCompleted = true
    // Require a new purchase for each new CV or template change
    // This will ensure users only get a single download per purchase
    
    if (!user) {
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    try {
      setLoading(true);
      setSelectedPlan(plan);

      // FIX: Use a fixed server URL instead of trying multiple ports
      const apiUrl = 'http://localhost:3005';
      let result = null;
      
      // Use the fixed API URL
      result = await tryCreateCheckoutSession(`${apiUrl}/api/checkout/create-session`, plan);
      
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
      // Determine checkout data based on plan type
      let checkoutData = {};
      
      if (plan.priceId) {
        // If plan has a direct priceId, use it
        checkoutData = { priceId: plan.priceId };
        
        // Add plan-specific metadata
        if (plan.name === 'Pay-Per-CV') {
          checkoutData.planType = 'pay-per-cv';
        } else if (plan.name === '24-Hour Access Pass') {
          checkoutData.planType = '24hour-access';
          checkoutData.accessDuration = '24hours';
        } else if (plan.interval === 'month' || plan.interval === 'year') {
          checkoutData.planType = 'subscription';
          checkoutData.planInterval = plan.interval === 'month' ? 'monthly' : 'annual';
        }
      } else {
        // Fall back to using interval for subscription plans
        checkoutData = { 
          planInterval: plan.interval === 'month' ? 'monthly' : 'annual',
          planType: 'subscription'
        };
      }

      console.log('Sending checkout request with data:', checkoutData);
        
      const response = await fetch('http://localhost:3005/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...checkoutData,
          userId: user.id,
          planName: plan.name
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

  // Add a function to render feature availability
  const renderFeatureAvailability = (isAvailable, featureName) => {
    return isAvailable ? (
      <div className="flex items-center">
        <svg
          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
        <span className="text-gray-700">{featureName}</span>
      </div>
    ) : (
      <div className="flex items-center">
        <svg
          className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <span className="text-gray-400">{featureName}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-5">Simple, Transparent Pricing</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">Choose the plan that's right for you and take your CV to the next level</p>
          
          {/* View toggle */}
          <div className="inline-flex p-1 bg-gray-100 rounded-lg shadow-sm mx-auto">
            <button
              className={`px-5 py-2.5 text-sm rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-gray-800 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                Card View
              </div>
            </button>
            <button
              className={`px-5 py-2.5 text-sm rounded-md transition-all ${
                viewMode === 'comparison' 
                  ? 'bg-white shadow-sm text-gray-800 font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setViewMode('comparison')}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                Comparison View
              </div>
            </button>
          </div>
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

        {viewMode === 'grid' ? (
          /* Pricing Cards - Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                id={plan.name === '24-Hour Access Pass' 
                    ? 'premium-cv-bundle' 
                    : plan.name === 'Monthly Subscription' 
                      ? 'monthly-subscription' 
                      : undefined}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 flex flex-col h-full
                  ${plan.popular ? 'ring-2 ring-[#E78F81] md:transform md:scale-105 z-10' : ''}
                  ${plan.name === getBestValuePlan() ? 'border-b-4 border-b-green-500' : ''}
                  ${plan.name === getRecommendedPlan() ? 'border-b-4 border-b-blue-500' : ''}
                  hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300
                `}
              >
                {plan.popular && (
                  <div className="bg-[#E78F81] text-white text-center py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
                    Most Popular
                  </div>
                )}
                {plan.name === getBestValuePlan() && !plan.popular && (
                  <div className="bg-green-500 text-white text-center py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
                    Best Value
                  </div>
                )}
                {plan.name === getRecommendedPlan() && !plan.popular && (
                  <div className="bg-blue-500 text-white text-center py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
                    Recommended
                  </div>
                )}
                <div className="p-5 sm:p-6 flex-grow flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-2xl sm:text-3xl font-bold">{plan.price === 0 ? 'Free' : `£${plan.price}`}</span>
                    {plan.interval && (
                      <span className="text-gray-500 text-sm">/{plan.interval}</span>
                    )}
                  </div>
                  
                  {/* Plan description based on type */}
                  <p className="text-sm text-gray-600 mb-5 min-h-[40px]">
                    {plan.description || (
                      plan.name === 'Free' && 'Get started with basic CV creation.' ||
                      plan.name === 'Pay-Per-CV' && 'Create a single optimized CV.'
                    )}
                  </p>
                  
                  {/* Key benefit tag */}
                  {plan.name === '24-Hour Access Pass' && (
                    <div className="mb-4 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1.5 rounded-md inline-flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Advanced AI Analysis & Personal Guidance
                    </div>
                  )}
                  
                  {plan.name === 'Monthly Subscription' && (
                    <div className="mb-4 bg-rose-50 text-rose-700 text-xs font-medium px-2.5 py-1.5 rounded-md inline-flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Complete Access With Unlimited CVs
                    </div>
                  )}
                  
                  {plan.name === 'Yearly Subscription' && (
                    <div className="mb-4 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1.5 rounded-md inline-flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      Best Value With Exclusive Tools
                    </div>
                  )}
                  
                  {plan.name === 'Pay-Per-CV' && (
                    <div className="mb-4 bg-yellow-50 text-yellow-700 text-xs font-medium px-2.5 py-1.5 rounded-md inline-flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Single CV Download
                    </div>
                  )}
                  
                  <div className="h-px w-full bg-gray-100 my-4"></div>
                  
                  <ul className="space-y-3 mb-6 text-sm flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-600">
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
                </div>
                <div className="p-5 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading && selectedPlan === plan}
                    className={`w-full py-2.5 px-4 rounded-md text-white text-sm font-medium transition-colors duration-200 ${
                      plan.popular
                        ? 'bg-[#E78F81] hover:bg-[#d36e62]'
                        : plan.name === 'Free'
                          ? 'bg-gray-500 hover:bg-gray-600'
                          : plan.name === getRecommendedPlan()
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : plan.name === getBestValuePlan()
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-[#2c3e50] hover:bg-[#1a2530]'
                    } ${(loading && selectedPlan === plan) ? 'opacity-50 cursor-not-allowed' : ''} shadow-sm hover:shadow`}
                  >
                    {(loading && selectedPlan === plan) ? 'Processing...' : plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Comparison Table View */
          <div className="overflow-x-auto max-w-7xl mx-auto rounded-lg shadow-lg">
            <table className="w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Features
                  </th>
                  {pricingPlans.map(plan => (
                    <th key={plan.name} className="py-4 px-4 text-center border-r border-gray-200 last:border-r-0">
                      <div className={`font-bold text-gray-900 ${
                        plan.popular ? 'text-[#E78F81]' : 
                        plan.name === getBestValuePlan() ? 'text-green-600' :
                        plan.name === getRecommendedPlan() ? 'text-blue-600' : ''
                      }`}>
                        {plan.name}
                      </div>
                      <div className="text-lg font-bold mt-1">{plan.price === 0 ? 'Free' : `£${plan.price}`}{plan.interval && <span className="text-xs text-gray-500">/{plan.interval}</span>}</div>
                      <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={loading && selectedPlan === plan}
                        className={`mt-2 py-1.5 px-3 rounded-md text-white text-xs font-medium transition-colors ${
                          plan.popular
                            ? 'bg-[#E78F81] hover:bg-[#d36e62]'
                            : plan.name === 'Free'
                              ? 'bg-gray-500 hover:bg-gray-600'
                              : plan.name === getRecommendedPlan()
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : plan.name === getBestValuePlan()
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-[#2c3e50] hover:bg-[#1a2530]'
                        } ${(loading && selectedPlan === plan) ? 'opacity-50 cursor-not-allowed' : ''} shadow-sm`}
                      >
                        {(loading && selectedPlan === plan) ? '...' : plan.buttonText}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-gray-50 bg-opacity-30">
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">Basic CV Creation</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Yes')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Yes')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Yes')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Yes')}</td>
                  <td className="py-3 px-4 text-center">{renderFeatureAvailability(true, 'Yes')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">Premium Templates</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Basic')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'All')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'All')}</td>
                  <td className="py-3 px-4 text-center">{renderFeatureAvailability(true, 'All + Exclusive')}</td>
                </tr>
                <tr className="bg-gray-50 bg-opacity-30">
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">AI Analysis</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Basic')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-blue-700 font-medium">Advanced</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-rose-500 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-rose-700 font-medium">Advanced</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-green-700 font-medium">Advanced+</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">Access Duration</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Unlimited')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Unlimited')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-blue-700 font-medium">24 Hours</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, '30 Days')}</td>
                  <td className="py-3 px-4 text-center">{renderFeatureAvailability(true, '1 Year')}</td>
                </tr>
                <tr className="bg-gray-50 bg-opacity-30">
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">Skills Gap Analysis</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Yes')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Yes')}</td>
                  <td className="py-3 px-4 text-center">{renderFeatureAvailability(true, 'Enhanced')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">Cover Letter Builder</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Yes')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Yes')}</td>
                  <td className="py-3 px-4 text-center">{renderFeatureAvailability(true, 'Yes')}</td>
                </tr>
                <tr className="bg-gray-50 bg-opacity-30">
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">Number of CVs</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Limited')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'One')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Multiple')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Unlimited')}</td>
                  <td className="py-3 px-4 text-center">{renderFeatureAvailability(true, 'Unlimited')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">Downloads per purchase</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Unlimited')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'One CV')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Multiple')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Unlimited')}</td>
                  <td className="py-3 px-4 text-center">{renderFeatureAvailability(true, 'Unlimited')}</td>
                </tr>
                <tr className="bg-gray-50 bg-opacity-30">
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">ATS Optimization</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Basic')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Advanced')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Advanced')}</td>
                  <td className="py-3 px-4 text-center">{renderFeatureAvailability(true, 'Advanced')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">Priority Support</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(false, 'No')}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{renderFeatureAvailability(true, 'Yes')}</td>
                  <td className="py-3 px-4 text-center">{renderFeatureAvailability(true, 'Premium')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Value Proposition - New Section */}
        <div className="max-w-5xl mx-auto mt-20 mb-16 text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Why Choose Our CV Builder?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-5">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">ATS-Optimized</h3>
              <p className="text-gray-600">Our templates are designed to pass through Applicant Tracking Systems to ensure your CV gets seen by recruiters.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-5">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
              <p className="text-gray-600">Advanced AI analysis provides personalized recommendations to improve your CV and increase your chances of landing interviews.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-5">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customizable</h3>
              <p className="text-gray-600">Tailor your CV for specific job applications with our easy-to-use tools and professional templates.</p>
            </div>
          </div>
        </div>

        {/* Add-ons Section - Improved */}
        <div className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Optional Add-ons</h2>
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="p-6 sm:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-6 md:mb-0 md:mr-8">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 p-2.5 rounded-full mr-4">
                        <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">{addon.name}</h3>
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">£{addon.price}</span>
                      <span className="text-gray-500 text-sm sm:text-base"> one-time</span>
                    </div>
                    <p className="text-gray-600 mb-5 text-base">
                      {addon.description}
                    </p>
                    <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
                      <ul className="space-y-3 mb-2">
                        <li className="flex items-start text-sm text-gray-600">
                          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Get AI-powered feedback on your LinkedIn profile</span>
                        </li>
                        <li className="flex items-start text-sm text-gray-600">
                          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Optimization recommendations for better visibility</span>
                        </li>
                        <li className="flex items-start text-sm text-gray-600">
                          <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Content suggestions aligned with industry trends</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleSubscribe(addon)}
                      disabled={loading && selectedPlan === addon}
                      className="w-full md:w-auto py-3 px-6 bg-indigo-600 text-white text-sm sm:text-base rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {(loading && selectedPlan === addon) ? 'Processing...' : addon.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section - New */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">What's the difference between 24-Hour Access and Monthly Subscription?</h3>
              <p className="text-gray-600">The <span className="font-medium text-blue-700">24-Hour Access Pass (£9.99)</span> gives you complete access to all premium features for 24 hours - perfect for creating your CV in one focused session. The <span className="font-medium text-rose-700">Monthly Subscription (£9.99/month)</span> provides the same premium features but with ongoing access and priority support, ideal if you're actively job hunting and need to create multiple CVs over time.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">How does the 24-Hour Access Pass work?</h3>
              <p className="text-gray-600">After purchasing the 24-Hour Access Pass, you'll have full access to all premium features including advanced AI analysis, skills gap identification, and all premium templates for exactly 24 hours from the time of purchase. This is ideal if you want to create a perfect CV in one focused session without committing to a subscription.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your Monthly or Yearly subscription at any time. Your access will continue until the end of your current billing period. If you only need our services for a short time, consider the 24-Hour Access Pass for a one-time payment with no subscription required.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">What's included in the Monthly Subscription?</h3>
              <p className="text-gray-600">The Monthly Subscription includes full access to all premium features including advanced AI analysis, skills gap identification, cover letter builder, all premium templates, and priority customer support. You can create unlimited CVs and access your account anytime during your subscription period. Unlike the 24-Hour Access Pass, subscribers get exclusive access to our priority support team.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">How does the Pay-Per-CV option work?</h3>
              <p className="text-gray-600">With the Pay-Per-CV option (£4.99), you can create, edit, and download a single optimized CV. This includes basic ATS optimization, premium template access, and formatting help. After downloading your completed CV, you would need to make another purchase to create a new CV. This is ideal if you only need one CV and don't require advanced AI analysis or ongoing access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 