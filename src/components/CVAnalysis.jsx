/* eslint-disable */
import { useState } from 'react';
import CVEnhancer from './CVEnhancer';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const CVAnalysis = ({ cv, score }) => {
  const [enhancedCV, setEnhancedCV] = useState(null);
  const [newScore, setNewScore] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user } = useAuth();

  const handleEnhance = (enhancedCV, newScore, explanation) => {
    setEnhancedCV(enhancedCV);
    setNewScore(newScore);
    setExplanation(explanation);
  };

  const handleDownload = async () => {
    if (!user) {
      alert('Please log in to download your enhanced CV');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Create a checkout session
      const response = await fetch('http://localhost:3002/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          cvId: cv.id,
          type: 'download'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">CV Analysis</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">ATS Compatibility Score</h3>
        <div className="flex items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600">
              {newScore || score}
            </span>
          </div>
          <div className="ml-4">
            <p className="text-gray-600">
              {newScore ? 'Enhanced Score' : 'Current Score'}
            </p>
            {explanation && (
              <p className="text-sm text-gray-500 mt-2">{explanation}</p>
            )}
          </div>
        </div>
      </div>

      {enhancedCV ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Enhanced CV</h3>
          <div className="bg-gray-50 p-4 rounded">
            {enhancedCV.sections.map((section, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-medium">{section.title}</h4>
                <p className="text-gray-600">{section.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={handleDownload}
              disabled={isProcessingPayment}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isProcessingPayment ? 'Processing...' : 'Download Enhanced CV (£9.99)'}
            </button>
          </div>
        </div>
      ) : (
        <CVEnhancer
          cvId={cv.id}
          currentScore={score}
          onEnhance={handleEnhance}
        />
      )}
    </div>
  );
};

export default CVAnalysis; 