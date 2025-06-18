import React from 'react';

const CareerPathway = ({ careerPathway, role, industry }) => {
  if (!careerPathway) return null;

  const { title, description, stages, qualifications, currentStage, educationAnalysis, nextSteps, publications } = careerPathway;

  const getStageStatus = (index) => {
    if (index < currentStage) return 'completed';
    if (index === currentStage) return 'current';
    return 'upcoming';
  };

  const getStageIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'current':
        return '📍';
      default:
        return '⏳';
    }
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'current':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Career Pathway: {role || 'Professional Development'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      {/* Current Education Analysis */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Your Current Education Level
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">Highest Qualification:</span> {educationAnalysis.highestDegree}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">Education Level:</span> {educationAnalysis.currentLevel}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">Suggested Next Step:</span>
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              {educationAnalysis.suggestedNextStep}
            </p>
          </div>
        </div>
      </div>

      {/* Career Stages */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Career Progression Pathway
        </h3>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(index);
            return (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 ${getStageColor(status)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getStageIcon(status)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {stage.level}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {stage.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {stage.description}
                    </p>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Requirements:
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                        {stage.requirements.map((req, reqIndex) => (
                          <li key={reqIndex}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Required Qualifications */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Essential Qualifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {qualifications.map((qual, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-green-500">📚</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{qual}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Publication Requirements (for academic roles) */}
      {publications && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Publication Requirements
          </h3>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
              <span className="font-medium">Minimum Publications Required:</span> {publications.minimum}
            </p>
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                Publication Types:
              </p>
              <ul className="text-sm text-purple-600 dark:text-purple-400 list-disc list-inside">
                {publications.types.map((type, index) => (
                  <li key={index}>{type}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Your Next Steps
          </h3>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-lg">
                  {step.type === 'education' ? '🎓' : step.type === 'career' ? '💼' : '📈'}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <span className={`text-xs font-medium uppercase ${getPriorityColor(step.priority)}`}>
                      {step.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathway; 