import { useState } from 'react';

const NewsletterSignup = ({ className }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Replace with your actual Mailchimp form URL
  const MAILCHIMP_URL = 'https://mycvbuilder.us10.list-manage.com/subscribe/post?u=YOUR_USER_ID&amp;id=YOUR_AUDIENCE_ID';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Option 1: Redirect to Mailchimp form with email prefilled
      window.location.href = `${MAILCHIMP_URL}&EMAIL=${encodeURIComponent(email)}`;
      
      // Option 2: If you prefer to handle the submission via AJAX
      // You would need to set up a proxy server endpoint as Mailchimp 
      // doesn't support CORS for direct API calls from browsers
      /*
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setSuccess(true);
        setEmail('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to subscribe. Please try again.');
      }
      */
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Newsletter signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Stay updated with CV tips and tricks
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Subscribe to our newsletter for the latest CV trends, job market insights, and career advice.
      </p>
      
      {success ? (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-md">
          Thank you for subscribing! Please check your email to confirm your subscription.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterSignup; 