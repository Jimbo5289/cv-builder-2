import { useState } from 'react';
import { useServer } from '../context/ServerContext';
import { trackConversion, trackFormInteraction } from '../utils/analytics';
import toast from 'react-hot-toast';

const NewsletterSignup = ({ className = '', inline = false }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { serverUrl } = useServer();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      trackFormInteraction('newsletter_signup', 'submit', { email });
      
      const response = await fetch(`${serverUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubscribed(true);
        setEmail('');
        
        trackConversion('newsletter_subscription', {
          method: 'newsletter_form',
          value: 1
        });
        
        if (data.mock) {
          toast.success('Newsletter subscription successful! (Development mode)');
        } else {
          toast.success('Thank you! Please check your email to confirm your subscription.');
        }
      } else {
        throw new Error(data.message || 'Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed && inline) {
    return (
      <div className={`text-center ${className}`}>
        <span className="text-green-600 text-sm font-medium">✓ Successfully subscribed!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={inline ? `flex gap-2 ${className}` : `space-y-4 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        required
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};

export default NewsletterSignup; 