import React from 'react';
import { FiTrendingUp, FiTarget, FiAlertTriangle, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import CourseRecommendations from './CourseRecommendations';

const AnalysisResultsCard = ({ analysisResults, onNewAnalysis }) => {
  if (!analysisResults) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 70) return 'bg-blue-100 dark:bg-blue-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (score >= 50) return 'bg-orange-100 dark:bg-orange-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getScoreDescription = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const ScoreCard = ({ title, score, description, icon: Icon }) => (
    <div className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getScoreBgColor(score)} border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${getScoreColor(score)}`} />
          <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
        </div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {getScoreDescription(score)}
        </span>
      </div>
      
      <div className="flex items-end gap-2 mb-2">
        <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
        <span className="text-lg text-gray-500 dark:text-gray-400 mb-1">%</span>
      </div>
      
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            score >= 80 ? 'bg-green-500' :
            score >= 70 ? 'bg-blue-500' :
            score >= 60 ? 'bg-yellow-500' :
            score >= 50 ? 'bg-orange-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            CV Analysis Results
          </h2>
          {analysisResults.industry && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <span>Analyzed for:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {analysisResults.industry.displayName}
              </span>
              {analysisResults.role && (
                <>
                  <span>•</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {analysisResults.role.displayName}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onNewAnalysis}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          New Analysis
        </button>
      </div>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScoreCard
          title="Overall Score"
          score={analysisResults.scores?.overall || analysisResults.score || 0}
          description="Your overall CV performance"
          icon={FiTrendingUp}
        />
        <ScoreCard
          title="ATS Score"
          score={analysisResults.scores?.ats || analysisResults.atsScore || 0}
          description="Applicant Tracking System compatibility"
          icon={FiTarget}
        />
        <ScoreCard
          title="Content Quality"
          score={analysisResults.scores?.content || analysisResults.contentScore || 0}
          description="Quality and relevance of content"
          icon={FiCheckCircle}
        />
        <ScoreCard
          title="Format & Structure"
          score={analysisResults.scores?.format || analysisResults.formatScore || 0}
          description="Professional formatting and layout"
          icon={FiTarget}
        />
      </div>

      {/* Job Match Score (if available) */}
      {(analysisResults.scores?.jobMatch || analysisResults.jobFitScore) && (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <FiTarget className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100">Job Match Score</h3>
              <p className="text-purple-700 dark:text-purple-200">How well your CV matches this specific job</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-5xl font-bold ${getScoreColor(analysisResults.scores?.jobMatch || analysisResults.jobFitScore)}`}>
              {analysisResults.scores?.jobMatch || analysisResults.jobFitScore}%
            </span>
            <div className="flex-1">
              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3">
                <div 
                  className="h-3 bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(analysisResults.scores?.jobMatch || analysisResults.jobFitScore, 100)}%` }}
                />
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-200 mt-2">
                {getScoreDescription(analysisResults.scores?.jobMatch || analysisResults.jobFitScore)} match for this position
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">CV Strengths</h3>
          </div>
          
          <ul className="space-y-3">
            {(analysisResults.feedback?.strengths || analysisResults.strengths || []).map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Improvement Areas</h3>
          </div>
          
          <ul className="space-y-3">
            {(analysisResults.feedback?.weaknesses || analysisResults.feedback?.improvements || analysisResults.recommendations || []).map((improvement, index) => (
              <li key={index} className="flex items-start gap-3">
                <FiAlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing Keywords */}
      {(analysisResults.feedback?.missingKeywords || analysisResults.missingKeywords) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Missing Keywords</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            These keywords from the job description are missing from your CV. Including them could improve your ATS score.
          </p>
          <div className="flex flex-wrap gap-2">
            {(analysisResults.feedback?.missingKeywords || analysisResults.missingKeywords || []).map((keyword, index) => (
              <span 
                key={index}
                className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Plan */}
      {analysisResults.improvementPlan && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Your Path to Improvement</h3>
              <p className="text-blue-700 dark:text-blue-200">
                Estimated timeframe: {analysisResults.improvementPlan.timeframe}
              </p>
            </div>
          </div>

          {/* Priority Areas */}
          {analysisResults.improvementPlan.priority && (
            <div className="mb-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Priority Areas</h4>
              <div className="space-y-2">
                {analysisResults.improvementPlan.priority.map((area, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-blue-800 dark:text-blue-200">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {analysisResults.improvementPlan.nextSteps && (
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Next Steps</h4>
              <div className="space-y-2">
                {analysisResults.improvementPlan.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FiArrowRight className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 dark:text-blue-200">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Course Recommendations */}
      {analysisResults.courseRecommendations && analysisResults.courseRecommendations.length > 0 && (
        <CourseRecommendations courses={analysisResults.courseRecommendations} />
      )}
    </div>
  );
};

export default AnalysisResultsCard; 