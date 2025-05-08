import { Link } from 'react-router-dom';

function TemplateShowcase() {
  const templates = [
    {
      id: 'double-column',
      name: 'Double Column',
      color: 'bg-[#B7E0FF]',
      description: 'Perfect for experienced professionals'
    },
    {
      id: 'modern',
      name: 'Modern',
      color: 'bg-[#FFF5CD]',
      description: 'Clean and contemporary design'
    },
    {
      id: 'creative',
      name: 'Creative',
      color: 'bg-[#FFCFB3]',
      description: 'Stand out with unique layout'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      color: 'bg-[#E78F81]',
      description: 'Simple and effective design'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-4">
            Pick a template and build your CV in minutes!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our professionally designed templates and customize them to match your style
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {templates.map((template) => (
            <div key={template.id} className="group">
              <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className={`w-full h-full ${template.color} bg-opacity-20 flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{template.name}</div>
                    <div className="text-gray-600">Template</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Link
                      to={`/create?template=${template.id}`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 text-[#2c3e50] bg-white rounded-full font-semibold hover:bg-[#FFCFB3] transition-all duration-200"
                    >
                      Use This Template
                    </Link>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#2c3e50] mb-1">{template.name}</h3>
              <p className="text-gray-600">{template.description}</p>
            </div>
          ))}
        </div>

        {/* Features Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-100">
          <div className="text-center">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="font-semibold text-[#2c3e50] mb-2">ATS-friendly professionally designed</h3>
            <p className="text-gray-600">Tested with major ATS systems</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="font-semibold text-[#2c3e50] mb-2">Customizable designs</h3>
            <p className="text-gray-600">Change fonts, colors and layouts</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="font-semibold text-[#2c3e50] mb-2">Multiple format support</h3>
            <p className="text-gray-600">Download in PDF, Word, or TXT</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link
            to="/templates"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#E78F81] rounded-full hover:bg-[#d36e62] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Browse All Templates
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TemplateShowcase; 