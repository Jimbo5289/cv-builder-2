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
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
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
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Next Steps to Improve Your CV
      </h3>
      
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex items-start">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getPriorityColor(rec.priority)}`}>
              {rec.id}
            </div>
            <div className="flex-1">
              <p className="text-gray-700">{rec.text}</p>
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 border ${getPriorityColor(rec.priority)}`}>
                {getPriorityLabel(rec.priority)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="/create" 
            className="inline-flex items-center justify-center px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New CV
          </Link>
          
          <Link 
            to="/templates" 
            className="inline-flex items-center justify-center px-4 py-2 bg-white text-[#3498db] border border-[#3498db] rounded-lg hover:bg-blue-50 transition-colors"
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