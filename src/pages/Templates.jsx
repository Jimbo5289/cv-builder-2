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
      image: "https://images.unsplash.com/photo-1602642379049-4d72dd65b09e?w=600&h=800&fit=crop&crop=top",
      description: "Clean, corporate-friendly layout with structured sections and professional blue accents. Perfect for business, finance, consulting, and traditional corporate roles.",
      features: ["ATS-friendly format", "Clear section headers", "Skills showcase", "Professional color scheme"],
      bestFor: "Corporate roles, business positions, traditional industries",
      color: "#4A90E2", // Blue color for professional template
    },
    {
      id: 2,
      name: "Creative",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=800&fit=crop&crop=center",
      description: "Modern design with visual sidebar, colorful gradients, and portfolio showcase. Features creative timeline and visual skill bars for design-focused careers.",
      features: ["Visual sidebar layout", "Portfolio section", "Creative timeline", "Colorful design elements"],
      bestFor: "Graphic design, marketing, advertising, creative agencies",
      color: "#E24A8B", // Pink color for creative template
    },
    {
      id: 3,
      name: "Executive",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=top",
      description: "Sophisticated two-column layout with elegant typography and premium styling. Emphasizes leadership experience, achievements, and executive presence.",
      features: ["Two-column premium layout", "Achievement highlights", "Executive summary", "Elegant typography"],
      bestFor: "C-level positions, senior management, leadership roles",
      color: "#4AE2C4", // Teal color for executive template
    },
    {
      id: 4,
      name: "Academic",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=800&fit=crop&crop=center",
      description: "Research-focused format with dedicated sections for publications, grants, and academic positions. Designed for scholarly and research careers.",
      features: ["Publications section", "Research interests", "Grant funding", "Academic formatting"],
      bestFor: "University positions, research roles, academic careers",
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#2c3e50] dark:text-white mb-4">
          Choose Your Perfect Template
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
          Select from our professionally designed templates, each crafted for specific career paths and industries. 
          Every template is ATS-friendly and fully customizable to match your personal style.
        </p>
        <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          All templates are designed to pass ATS screening systems
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {templates.map((template) => (
          <div 
            key={template.id}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Template Preview */}
            <div className="relative overflow-hidden" style={{ height: '400px' }}>
              <img
                src={template.image}
                alt={`${template.name} CV Template Preview - Professional ${template.description} resume design`}
                className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                <div className="p-6 w-full">
                  <Link
                    to={`/create?template=${template.id}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 text-white bg-[#E78F81] hover:bg-[#d36e62] rounded-lg font-semibold transition-all duration-200 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Start Building Now
                  </Link>
                </div>
              </div>
              {/* Template category badge */}
              <div className="absolute top-4 left-4">
                <span 
                  className="px-3 py-1 rounded-full text-white font-medium text-sm shadow-lg"
                  style={{ backgroundColor: template.color }}
                >
                  {template.name}
                </span>
              </div>
            </div>

            {/* Template Information */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-bold text-[#2c3e50] dark:text-white group-hover:text-[#E78F81] transition-colors duration-200">
                  {template.name} Template
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ATS-Friendly
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {template.description}
              </p>

              {/* Best For */}
              <div className="mb-4">
                <span className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Best for:
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-5">
                  {template.bestFor}
                </p>
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Key Features:</span>
                <div className="grid grid-cols-2 gap-2">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                      <div 
                        className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                        style={{ backgroundColor: template.color }}
                      ></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
                  onClick={() => handleDownload(template)}
                  aria-label={`Preview ${template.name} template`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
                <Link
                  to={`/create?template=${template.id}`}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium"
                  style={{ backgroundColor: template.color }}
                >
                  Use Template
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information Section */}
      <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#2c3e50] dark:text-white mb-6 text-center">
          Why Choose Our Templates?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-semibold text-[#2c3e50] dark:text-white mb-2">Industry-Specific Design</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Each template is carefully crafted for specific career paths and industries, ensuring your CV stands out to hiring managers.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-semibold text-[#2c3e50] dark:text-white mb-2">ATS-Optimized</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              All templates are tested with major Applicant Tracking Systems to ensure your CV gets past the initial screening.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-semibold text-[#2c3e50] dark:text-white mb-2">Fully Customizable</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Personalize colors, fonts, and layouts to match your personal brand while maintaining professional standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Templates; 