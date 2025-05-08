import { Link } from 'react-router-dom';

// Import the PDF files directly
import professionalPdf from '../assets/cv-templates-pdf/professional_cv.pdf';
import creativePdf from '../assets/cv-templates-pdf/creative_cv.pdf';
import executivePdf from '../assets/cv-templates-pdf/executive_cv.pdf';
import academicPdf from '../assets/cv-templates-pdf/academic_cv.pdf';

function Templates() {
  const templates = [
    {
      id: 1,
      name: "Professional",
      description: "Clean and modern design perfect for any industry",
      // Using the imported PDF files
      image: professionalPdf,
    },
    {
      id: 2,
      name: "Creative",
      description: "Stand out with a unique and artistic layout",
      image: creativePdf,
    },
    {
      id: 3,
      name: "Executive",
      description: "Sophisticated design for senior positions",
      image: executivePdf,
    },
    {
      id: 4,
      name: "Academic",
      description: "Structured layout for academic and research positions",
      image: academicPdf,
    }
  ];

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
            {/* Using object tag for PDF display */}
            <object
              data={template.image}
              type="application/pdf"
              className="w-full h-72 object-cover"
              aria-label={`${template.name} Template Preview`}
            >
              <p className="text-center py-4">
                Your browser doesn't support PDF display. 
                <a href={template.image} className="text-blue-500 underline ml-1" target="_blank" rel="noopener noreferrer">
                  Open PDF
                </a>
              </p>
            </object>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {template.description}
              </p>
              <Link
                to={`/create?template=${template.id}`}
                className="inline-block bg-[#E78F81] text-white px-6 py-2 rounded-lg hover:bg-[#d36e62] transition"
              >
                Use This Template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates; 