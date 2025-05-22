import React from 'react';

const AnalysisProgressTracker = ({ currentStep, isAnalyzing }) => {
  const steps = [
    { id: 1, name: 'Upload CV', description: 'Select your CV file' },
    { id: 2, name: 'Analysis', description: 'AI processing your CV' },
    { id: 3, name: 'Results', description: 'Review your analysis' },
    { id: 4, name: 'Next Steps', description: 'Improve your CV' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative group">
              <div 
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-200 
                  ${currentStep >= step.id 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }
                  ${step.id === 2 && isAnalyzing ? 'animate-pulse border-blue-500 bg-blue-100 dark:bg-blue-900/30' : ''}
                `}
              >
                {step.id === 2 && isAnalyzing ? (
                  <svg className="animate-spin h-4 w-4 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <div className="text-xs font-medium mt-2 text-center text-gray-700 dark:text-gray-300">
                {step.name}
              </div>
              
              {/* Tooltip */}
              <div className="hidden group-hover:block absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                {step.description}
              </div>
            </div>
            
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-2 
                  ${currentStep > index + 1 
                    ? 'bg-blue-500' 
                    : currentStep === index + 1 
                      ? 'bg-gradient-to-r from-blue-500 to-gray-300 dark:from-blue-500 dark:to-gray-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AnalysisProgressTracker; 