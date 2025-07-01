/* eslint-disable */
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';

const CvAnalysisNextSteps = ({ analysisResults, analysisType, role, industry, originalCvText }) => {
  // Use actual analysis results if available, with fallbacks
  const score = analysisResults?.score || 0;
  const improvements = analysisResults?.improvements || [];
  const missingKeywords = analysisResults?.missingKeywords || [];
  const recommendations = analysisResults?.recommendations || [];
  const improvementSuggestions = analysisResults?.improvementSuggestions || {};
  const careerTransitionAdvice = analysisResults?.careerTransitionAdvice || null;
  const timeToCompetitive = analysisResults?.timeToCompetitive || null;
  
  // New detailed improvement data
  const detailedImprovements = analysisResults?.detailedImprovements || [];
  
  // Debug logging
  console.log('CvAnalysisNextSteps - analysisResults:', analysisResults);
  console.log('CvAnalysisNextSteps - detailedImprovements:', detailedImprovements);
  console.log('CvAnalysisNextSteps - analysisType:', analysisType);
  
  // State for managing expanded improvement details
  const [expandedImprovements, setExpandedImprovements] = useState(new Set());

  // Get current location to determine which analysis page we're on
  const location = useLocation();
  const isOnRoleSpecificPage = location.pathname === '/cv-analyze-by-role';

  const { getAuthHeader } = useAuth();
  const { apiUrl } = useServer();

  // Toggle detailed improvement view
  const toggleImprovement = (improvementId) => {
    const newExpanded = new Set(expandedImprovements);
    if (newExpanded.has(improvementId)) {
      newExpanded.delete(improvementId);
    } else {
      newExpanded.add(improvementId);
    }
    setExpandedImprovements(newExpanded);
  };

  // Analyse Again logic
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [reanalyzeResults, setReanalyzeResults] = useState(null);

  const handleReanalyze = async () => {
    if (!originalCvText) return;
    
    try {
      setIsReanalyzing(true);
      
      const headers = getAuthHeader();
      const response = await fetch(`${apiUrl}/api/cv/analyze-only`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cvText: originalCvText,
          role: role || 'general',
          industry: industry || 'general'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setReanalyzeResults(data);
        console.log('Re-analysis complete:', data);
      } else {
        console.error('Re-analysis failed:', response.status);
      }
    } catch (error) {
      console.error('Error during re-analysis:', error);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const getPersonalizedNextSteps = () => {
    const steps = [];
    let stepId = 1;

    // Priority 1: Address specific improvements from AI analysis
    if (improvements && improvements.length > 0) {
      improvements.slice(0, 3).forEach((improvement) => {
        const priority = score < 60 ? 'high' : score < 80 ? 'medium' : 'low';
        steps.push({
          id: stepId++,
          text: improvement,
          priority: priority,
          type: 'improvement',
          source: 'ai_analysis'
        });
      });
    }

    // Priority 2: Address missing keywords if they exist
    if (missingKeywords && missingKeywords.length > 0 && steps.length < 4) {
      const keywordText = missingKeywords.length === 1 
        ? `Add the missing keyword "${missingKeywords[0]}" to relevant sections of your CV`
        : `Incorporate these missing keywords: ${missingKeywords.slice(0, 3).join(', ')}`;
      
      steps.push({
        id: stepId++,
        text: keywordText,
        priority: score < 70 ? 'high' : 'medium',
        type: 'keywords',
        source: 'keyword_analysis'
      });
    }

    // Priority 3: Use improvement suggestions by category
    if (improvementSuggestions.content && steps.length < 4) {
      steps.push({
        id: stepId++,
        text: improvementSuggestions.content,
        priority: score < 70 ? 'medium' : 'low',
        type: 'content',
        source: 'structured_analysis'
      });
    }

    if (improvementSuggestions.format && steps.length < 4) {
      steps.push({
        id: stepId++,
        text: improvementSuggestions.format,
        priority: score < 60 ? 'high' : 'medium',
        type: 'format',
        source: 'structured_analysis'
      });
    }

    // Priority 4: Career transition advice if available
    if (careerTransitionAdvice && steps.length < 4) {
      steps.push({
        id: stepId++,
        text: careerTransitionAdvice,
        priority: 'medium',
        type: 'career_transition',
        source: 'career_analysis'
      });
    }

    // Priority 5: Use recommendations as fallback
    if (recommendations && recommendations.length > 0 && steps.length < 4) {
      const remainingSlots = 4 - steps.length;
      recommendations.slice(0, remainingSlots).forEach((recommendation) => {
        steps.push({
          id: stepId++,
          text: recommendation,
          priority: 'low',
          type: 'recommendation',
          source: 'general_recommendations'
        });
      });
    }

    // Fallback: Generic steps if we have very few specific recommendations
    if (steps.length < 2) {
      const genericSteps = [
        'Review and update your personal statement to better highlight your key achievements',
        'Ensure all work experience entries include specific, quantifiable achievements',
        'Add relevant keywords that align with your target job descriptions',
        'Check formatting consistency throughout your CV (fonts, spacing, bullet points)',
        'Include relevant certifications or training that demonstrate your expertise'
      ];

      genericSteps.slice(0, 4 - steps.length).forEach((step) => {
        steps.push({
          id: stepId++,
          text: step,
          priority: 'medium',
          type: 'generic',
          source: 'fallback'
        });
      });
    }

    return steps.slice(0, 4); // Limit to 4 steps max
  };

  const nextSteps = getPersonalizedNextSteps();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Priority';
    }
  };

  // Don't render if no analysis results
  if (!analysisResults) {
    return null;
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow rounded-lg p-6 border border-blue-100 dark:border-blue-900/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Next Steps & Recommendations
        </h2>
      </div>

      <div className="space-y-6">
        {analysisResults && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">AI Analysis Insight:</p>
                <p>
                  {analysisResults.relevanceAnalysis || 
                   `Based on your CV analysis, we've identified ${nextSteps.length} key areas for improvement that will help you stand out to employers.`}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Detailed Improvements Section */}
        {detailedImprovements && detailedImprovements.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Specific Content Improvements
            </h4>
            
            <div className="space-y-4">
              {detailedImprovements.map((improvement) => (
                <div key={improvement.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => toggleImprovement(improvement.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(improvement.priority)}`}>
                            {getPriorityLabel(improvement.priority)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {improvement.section}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{improvement.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{improvement.reason}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedImprovements.has(improvement.id) ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {expandedImprovements.has(improvement.id) && (
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="mt-4 space-y-4">
                        
                        {/* Original Text */}
                        {improvement.originalText && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Text:</h5>
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{improvement.originalText}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Analysis */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Analysis:</h5>
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-300">{improvement.analysis}</p>
                          </div>
                        </div>
                        
                        {/* Suggested Improvement */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended Rewrite:</h5>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{improvement.suggestedText}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* General Next Steps */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Recommended Action Steps
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {nextSteps.map((step) => (
              <div key={step.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    step.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    step.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(step.priority)}`}>
                        {getPriorityLabel(step.priority)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{step.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Transition Advice - Only show if available and relevant */}
        {careerTransitionAdvice && timeToCompetitive && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Career Transition Insight
            </h4>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">{careerTransitionAdvice}</p>
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  <strong>Estimated time to become competitive:</strong> {timeToCompetitive}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Take Action</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              to="/create"
              className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Your CV
            </Link>
            
            {!isOnRoleSpecificPage && (
              <Link
                to="/cv-analyze-by-role"
                className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2v0" />
                </svg>
                Role-Specific Analysis
              </Link>
            )}
            
            <button
              onClick={handleReanalyze}
              disabled={isReanalyzing || !originalCvText}
              className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isReanalyzing ? 'Analyzing...' : 'Analyze Again'}
            </button>
          </div>
        </div>

        {/* Re-analysis Results */}
        {reanalyzeResults && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">Updated Analysis Results:</h5>
            <p className="text-sm text-green-700 dark:text-green-400">
              New Score: {reanalyzeResults.score}/100 
              {reanalyzeResults.score > score && <span className="ml-2 text-green-600">📈 Improved!</span>}
              {reanalyzeResults.score < score && <span className="ml-2 text-red-600">📉 Needs work</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CvAnalysisNextSteps; 