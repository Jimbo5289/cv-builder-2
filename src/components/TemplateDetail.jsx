import { useState } from 'react';
import { Link } from 'react-router-dom';

function TemplateDetail({ template }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Template specific features
  const features = {
    "Professional": [
      "Clean, minimal design for corporate settings",
      "Structured layout emphasizing work experience",
      "Professional typography and color scheme",
      "Optimized for Applicant Tracking Systems (ATS)",
      "Ideal for finance, consulting, management roles"
    ],
    "Creative": [
      "Modern layout with visual elements",
      "Balanced white space for better readability",
      "Space for portfolio highlights or achievements",
      "Eye-catching design elements",
      "Perfect for design, marketing, and media roles"
    ],
    "Executive": [
      "Sophisticated design for senior professionals",
      "Emphasis on leadership achievements",
      "Strategic placement of qualifications",
      "Premium look and feel",
      "Tailored for C-suite, directors, and senior managers"
    ],
    "Academic": [
      "Structured format for academic credentials",
      "Sections for publications and research",
      "Clean organization of educational history",
      "Focus on academic achievements",
      "Ideal for professors, researchers, and scholars"
    ],
  };

  return (
    <>
      <button
        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2 underline"
        onClick={() => setIsOpen(true)}
      >
        View details
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-[#2c3e50] dark:text-white">
                  {template.name} Template
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={template.photo || template.image} 
                    alt={`${template.name} Template Preview`}
                    className="w-full h-auto rounded-lg shadow-md mb-4"
                  />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {template.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#2c3e50] dark:text-white mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2 mb-6">
                    {features[template.name]?.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="space-x-3">
                    <Link
                      to={`/create?template=${template.id}`}
                      className="inline-block bg-[#E78F81] dark:bg-[#d36e62] text-white px-6 py-2 rounded-lg hover:bg-[#d36e62] dark:hover:bg-[#c65c50] transition"
                    >
                      Use This Template
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TemplateDetail; 