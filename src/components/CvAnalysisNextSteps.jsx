import { Link } from 'react-router-dom';

const CvAnalysisNextSteps = ({ score, analysisType }) => {
  // Determine recommendations based on score and analysis type
  const getRecommendations = () => {
    if (score < 60) {
      return [
        { id: 1, text: 'Update your CV content based on the suggested keywords', priority: 'high' },
        { id: 2, text: 'Review your formatting to ensure ATS compatibility', priority: 'high' },
        { id: 3, text: 'Add more specific achievements with quantifiable results', priority: 'medium' }
      ];
    } else if (score < 80) {
      return [
        { id: 1, text: 'Enhance your skills section with the suggested keywords', priority: 'medium' },
        { id: 2, text: 'Add more industry-specific terminology to stand out', priority: 'medium' },
        { id: 3, text: 'Consider reorganizing sections to highlight your strengths', priority: 'low' }
      ];
    } else {
      return [
        { id: 1, text: 'Polish your professional statement for even more impact', priority: 'low' },
        { id: 2, text: 'Consider adding additional certifications or projects', priority: 'low' },
        { id: 3, text: 'Your CV is in great shape - focus on customizing for specific job applications', priority: 'low' }
      ];
    }
  };

  // Get priority color
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

  const recommendations = getRecommendations();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Next Steps to Improve Your CV
      </h3>
      
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex items-start">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getPriorityColor(rec.priority)}`}>
              {rec.id}
            </div>
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300">{rec.text}</p>
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 border ${getPriorityColor(rec.priority)}`}>
                {getPriorityLabel(rec.priority)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
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
        </div>
      </div>
    </div>
  );
};

export default CvAnalysisNextSteps; 