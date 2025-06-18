/* eslint-disable */
import { useState } from 'react';
import CVEnhancer from './CVEnhancer';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const CVAnalysis = ({ cv, analysisResults }) => {
  const [enhancedCV, setEnhancedCV] = useState(null);
  const [newScore, setNewScore] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user } = useAuth();

  // Extract analysis data with fallbacks for backward compatibility
  const score = analysisResults?.score || analysisResults || 0;
  const confidence = analysisResults?.confidence || 75;
  const analysisQuality = analysisResults?.analysisQuality || 'medium';
  const fieldCompatibility = analysisResults?.fieldCompatibility || 'medium';
  const timeToCompetitive = analysisResults?.timeToCompetitive || '1-2 years';
  const modelsUsed = analysisResults?.modelsUsed || [];
  const relevanceAnalysis = analysisResults?.relevanceAnalysis || '';
  const careerTransitionAdvice = analysisResults?.careerTransitionAdvice || '';
  const competitiveAdvantages = analysisResults?.competitiveAdvantages || [];
  const keySkillGaps = analysisResults?.keySkillGaps || [];
  const strengths = analysisResults?.strengths || [];
  const recommendations = analysisResults?.recommendations || [];

  const handleEnhance = (enhancedCV, newScore, explanation) => {
    setEnhancedCV(enhancedCV);
    setNewScore(newScore);
    setExplanation(explanation);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompatibilityBadge = (compatibility) => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    return colors[compatibility] || colors.medium;
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
      <h2 className="text-2xl font-bold mb-4">AI-Powered CV Analysis</h2>
      
      {/* Multi-Model Analysis Header */}
      {modelsUsed.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-blue-800">
                Multi-Model Analysis
              </span>
              <p className="text-xs text-blue-600">
                Powered by {modelsUsed.join(' + ')}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                {confidence}% Confidence
              </div>
              <div className="text-xs text-gray-500">
                Quality: {analysisQuality}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Score Display */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
        <div className="flex items-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreColor(newScore || score)}`}>
            <span className="text-3xl font-bold">
              {newScore || score}
            </span>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-gray-600">
              {newScore ? 'Enhanced Score' : 'Current Score'}
            </p>
            {explanation && (
              <p className="text-sm text-gray-500 mt-2">{explanation}</p>
            )}
            
            {/* Field Compatibility */}
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompatibilityBadge(fieldCompatibility)}`}>
                {fieldCompatibility.charAt(0).toUpperCase() + fieldCompatibility.slice(1)} Compatibility
              </span>
              {timeToCompetitive && (
                <span className="text-xs text-gray-500">
                  Time to competitive: {timeToCompetitive}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Insights */}
      {(relevanceAnalysis || careerTransitionAdvice) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Analysis Insights</h4>
          {relevanceAnalysis && (
            <p className="text-sm text-gray-700 mb-2">{relevanceAnalysis}</p>
          )}
          {careerTransitionAdvice && (
            <p className="text-sm text-blue-700 italic">{careerTransitionAdvice}</p>
          )}
        </div>
      )}

      {/* Strengths and Advantages */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {strengths.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Key Strengths</h4>
            <ul className="text-sm text-green-700 space-y-1">
              {strengths.slice(0, 4).map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {competitiveAdvantages.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Competitive Advantages</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {competitiveAdvantages.slice(0, 4).map((advantage, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">★</span>
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Skill Gaps and Recommendations */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {keySkillGaps.length > 0 && (
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Key Skill Gaps</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              {keySkillGaps.slice(0, 4).map((gap, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Recommendations</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              {recommendations.slice(0, 4).map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-600 mr-2">→</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
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