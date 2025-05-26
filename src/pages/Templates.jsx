import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import { useTemplate } from '../context/TemplateContext';

// Remove PDF imports that cause errors
// import professionalPdf from '../assets/cv-templates-pdf/professional_cv.pdf';
// import creativePdf from '../assets/cv-templates-pdf/creative_cv.pdf';
// import executivePdf from '../assets/cv-templates-pdf/executive_cv.pdf';
// import academicPdf from '../assets/cv-templates-pdf/academic_cv.pdf';

const Templates = () => {
  const navigate = useNavigate();
  const { templates, loading, selectedTemplate, setSelectedTemplate } = useTemplate();
  const { createCV } = useServer();
  const [error, setError] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  // Function to handle template download
  const handleDownload = (template) => {
    // This is a placeholder - you can implement PDF generation later
    alert(`Download functionality for ${template.name} template will be implemented soon!`);
    
    // For now, we'll create a colored div to demonstrate the template style
    const coloredDiv = document.createElement('div');
    coloredDiv.style.width = '100%';
    coloredDiv.style.height = '100vh';
    coloredDiv.style.backgroundColor = template.color;
    coloredDiv.style.color = 'white';
    coloredDiv.style.display = 'flex';
    coloredDiv.style.alignItems = 'center';
    coloredDiv.style.justifyContent = 'center';
    coloredDiv.style.fontSize = '24px';
    coloredDiv.style.fontWeight = 'bold';
    coloredDiv.style.padding = '20px';
    coloredDiv.textContent = `${template.name} CV Template - Placeholder`;
    
    // Append to body, then use browser print dialog
    document.body.appendChild(coloredDiv);
    window.print();
    document.body.removeChild(coloredDiv);
  };

  // Function to trigger a test error for Sentry
  const triggerTestError = () => {
    try {
      // Deliberately throw an error for Sentry to capture
      throw new Error("This is a test error for Sentry!");
    } catch (err) {
      console.error("Test error triggered:", err);
      setError("Test error triggered for Sentry monitoring");
      // The error will be automatically captured by Sentry
    }
  };

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
    <div className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-[#2c3e50] dark:text-white mb-8 text-center">
        Choose Your Template
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
        Select from our professionally designed templates to create your perfect CV. Each template is fully customizable to match your style.
      </p>
      
      {/* Add Sentry test button */}
      <div className="mb-6">
        <button 
          onClick={triggerTestError}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Test Sentry Error Monitoring
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <p>Loading templates...</p>
        ) : (
          templates.map((template) => (
            <div 
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <div className="relative pb-[56.25%]">
                {template.photo ? (
                  <img
                    src={template.photo}
                    alt={`${template.name} Template Example`}
                    className={`absolute w-full h-full object-cover transition-all duration-300 ${hoveredTemplate === template.id ? 'blur-sm' : ''}`}
                  />
                ) : (
                  <img
                    src={template.image}
                    alt={`${template.name} Template`}
                    className={`absolute w-full h-full object-cover transition-all duration-300 ${hoveredTemplate === template.id ? 'blur-sm' : ''}`}
                  />
                )}
                
                {/* Template details overlay that appears on hover */}
                {hoveredTemplate === template.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 animate-fade-in text-white">
                    <div className="max-w-md">
                      <h3 className="text-2xl font-bold mb-3">{template.name}</h3>
                      <h4 className="font-medium mb-2">Key Features:</h4>
                      <ul className="space-y-2">
                        {features[template.name]?.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2c3e50] dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    onClick={() => handleDownload(template)}
                    aria-label={`Download ${template.name} template`}
                  >
                    <span className="sr-only">Download</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <Link
                    to={`/create?template=${template.id}`}
                    className="inline-block bg-[#E78F81] dark:bg-[#d36e62] text-white px-6 py-2 rounded-lg hover:bg-[#d36e62] dark:hover:bg-[#c65c50] transition"
                  >
                    Use This Template
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export default Templates; 