/* eslint-disable */
import { Link } from 'react-router-dom';

const CvAnalysisNextSteps = ({ analysisResults, analysisType, role, industry }) => {
  // Use actual analysis results if available, with fallbacks
  const score = analysisResults?.score || 0;
  const improvements = analysisResults?.improvements || [];
  const missingKeywords = analysisResults?.missingKeywords || [];
  const recommendations = analysisResults?.recommendations || [];
  const improvementSuggestions = analysisResults?.improvementSuggestions || {};
  const careerTransitionAdvice = analysisResults?.careerTransitionAdvice || null;
  const timeToCompetitive = analysisResults?.timeToCompetitive || null;

  // Generate personalized next steps based on actual analysis results
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
    if (careerTransitionAdvice && steps.length < 5) {
      steps.push({
        id: stepId++,
        text: careerTransitionAdvice,
        priority: 'medium',
        type: 'career_advice',
        source: 'career_analysis'
      });
    }

    // Fallback: If no AI data, provide score-based generic advice
    if (steps.length === 0) {
      if (score < 60) {
        steps.push(
          { id: 1, text: 'Focus on improving your CV content with specific achievements and metrics', priority: 'high', type: 'fallback' },
          { id: 2, text: 'Ensure your CV format is ATS-compatible and professionally structured', priority: 'high', type: 'fallback' },
          { id: 3, text: 'Add more relevant keywords for your target industry and role', priority: 'medium', type: 'fallback' }
        );
      } else if (score < 80) {
        steps.push(
          { id: 1, text: 'Enhance your skills section with more specific technical competencies', priority: 'medium', type: 'fallback' },
          { id: 2, text: 'Add more quantifiable results and achievements to stand out', priority: 'medium', type: 'fallback' },
          { id: 3, text: 'Consider tailoring your CV more specifically for your target roles', priority: 'low', type: 'fallback' }
        );
      } else {
        steps.push(
          { id: 1, text: 'Your CV is strong - focus on customizing it for specific job applications', priority: 'low', type: 'fallback' },
          { id: 2, text: 'Consider adding any recent certifications or projects to stay current', priority: 'low', type: 'fallback' },
          { id: 3, text: 'Polish your professional summary to make an even stronger first impression', priority: 'low', type: 'fallback' }
        );
      }
    }

    return steps.slice(0, 4); // Limit to top 4 recommendations
  };

  // Get priority color based on priority level
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800/50';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800/50';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800/50';
      default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800/50';
    }
  };

  // Get priority label
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Recommended';
    }
  };

  // Get step icon based on type
  const getStepIcon = (type) => {
    switch (type) {
      case 'improvement':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'keywords':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'content':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'format':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        );
      case 'career_advice':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        );
    }
  };

  const nextSteps = getPersonalizedNextSteps();

  // Create dynamic title based on context
  const getTitle = () => {
    if (analysisType === 'role-specific' && role && industry) {
      return `Next Steps to Excel as a ${role} in ${industry}`;
    }
    if (timeToCompetitive) {
      return `Your Path to Improvement (Est. ${timeToCompetitive})`;
    }
    return 'Personalized Next Steps for Your CV';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {getTitle()}
        </h3>
        {score > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current Score: <span className="font-semibold">{score}/100</span>
          </div>
        )}
      </div>

      {/* Analysis-based insights */}
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
      
      <div className="space-y-4">
        {nextSteps.map((step) => (
          <div key={step.id} className="flex items-start group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getPriorityColor(step.priority)}`}>
              {step.source === 'ai_analysis' ? getStepIcon(step.type) : step.id}
            </div>
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300">{step.text}</p>
              <div className="flex items-center mt-1 space-x-2">
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${getPriorityColor(step.priority)}`}>
                  {getPriorityLabel(step.priority)}
                </span>
                {step.source === 'ai_analysis' && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                    AI Recommendation
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional context if available */}
      {timeToCompetitive && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center text-sm text-green-800 dark:text-green-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Estimated time to become competitive: {timeToCompetitive}</span>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="/create" 
            className="inline-flex items-center justify-center px-4 py-2 bg-[#3498db] dark:bg-blue-700 text-white rounded-lg hover:bg-[#2980b9] dark:hover:bg-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New CV
          </Link>
          
          <Link 
            to="/templates" 
            className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 text-[#3498db] dark:text-blue-400 border border-[#3498db] dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Browse Templates
          </Link>
          
          {missingKeywords && missingKeywords.length > 0 && (
            <Link 
              to="/cv-analyze-by-role" 
              className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Role-Specific Analysis
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvAnalysisNextSteps; 