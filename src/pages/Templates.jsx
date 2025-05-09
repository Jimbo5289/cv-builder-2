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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#2c3e50] mb-8 text-center">
        Choose Your Template
      </h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
        Select from our professionally designed templates to create your perfect CV. Each template is fully customizable to match your style.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div 
            key={template.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={template.image}
              alt={`${template.name} Template`}
              className="w-full h-72 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {template.description}
              </p>
              <div className="template-actions">
                <button 
                  className="download-btn"
                  onClick={() => handleDownload(template)}
                >
                  Download
                </button>
                <Link
                  to={`/create?template=${template.id}`}
                  className="inline-block bg-[#E78F81] text-white px-6 py-2 rounded-lg hover:bg-[#d36e62] transition"
                >
                  Use This Template
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