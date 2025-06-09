/* eslint-disable */
import { Link } from 'react-router-dom';

// Remove PDF imports that cause errors
// import professionalPdf from '../assets/cv-templates-pdf/professional_cv.pdf';
// import creativePdf from '../assets/cv-templates-pdf/creative_cv.pdf';
// import executivePdf from '../assets/cv-templates-pdf/executive_cv.pdf';
// import academicPdf from '../assets/cv-templates-pdf/academic_cv.pdf';

function Templates() {
  const templates = [
    {
      id: 1,
      name: "Professional",
      image: "/images/templates/professional.svg",
      description: "A clean and traditional layout, perfect for corporate roles.",
      // Instead of PDF, use a function to handle download
      // pdf: professionalPdf,
      color: "#4A90E2", // Blue color for professional template
    },
    {
      id: 2,
      name: "Creative",
      image: "/images/templates/creative.svg",
      description: "A modern design with visual elements for creative industries.",
      // pdf: creativePdf,
      color: "#E24A8B", // Pink color for creative template
    },
    {
      id: 3,
      name: "Executive",
      image: "/images/templates/executive.svg",
      description: "A sophisticated format for senior leadership positions.",
      // pdf: executivePdf,
      color: "#4AE2C4", // Teal color for executive template
    },
    {
      id: 4,
      name: "Academic",
      image: "/images/templates/academic.svg",
      description: "Tailored for academic and research positions.",
      // pdf: academicPdf,
      color: "#E2A64A", // Orange color for academic template
    },
  ];

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

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-[#2c3e50] dark:text-white mb-8 text-center">
        Choose Your Template
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
        Select from our professionally designed templates to create your perfect CV. Each template is fully customizable to match your style.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((template) => (
          <div 
            key={template.id}
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
          >
            <div className="relative pb-[56.25%] overflow-hidden">
              <img
                src={template.image}
                alt={`${template.name} Template`}
                className="absolute w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                <div className="p-6 w-full">
                  <Link
                    to={`/create?template=${template.id}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 text-white bg-[#E78F81] hover:bg-[#d36e62] rounded-lg font-semibold transition-all duration-200"
                  >
                    Use This Template
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#2c3e50] dark:text-white mb-2 group-hover:text-[#E78F81] transition-colors duration-200">
                {template.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
                  onClick={() => handleDownload(template)}
                  aria-label={`Download ${template.name} template`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </button>
                <Link
                  to={`/create?template=${template.id}`}
                  className="inline-flex items-center bg-[#E78F81] dark:bg-[#d36e62] text-white px-6 py-2 rounded-lg hover:bg-[#d36e62] dark:hover:bg-[#c65c50] transition-colors duration-200"
                >
                  Use This Template
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates; 