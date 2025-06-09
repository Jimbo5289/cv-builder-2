/* eslint-disable */
import { Link } from 'react-router-dom';

function TemplateShowcase() {
  const templates = [
    {
      id: 'double-column',
      name: 'Double Column',
      color: 'bg-[#B7E0FF]',
      darkColor: 'dark:bg-blue-900/30',
      description: 'Perfect for experienced professionals'
    },
    {
      id: 'modern',
      name: 'Modern',
      color: 'bg-[#FFF5CD]',
      darkColor: 'dark:bg-yellow-900/30',
      description: 'Clean and contemporary design'
    },
    {
      id: 'creative',
      name: 'Creative',
      color: 'bg-[#FFCFB3]',
      darkColor: 'dark:bg-orange-900/30',
      description: 'Stand out with unique layout'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      color: 'bg-[#E78F81]',
      darkColor: 'dark:bg-red-900/30',
      description: 'Simple and effective design'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2c3e50] dark:text-white mb-4">
            Pick a template and build your CV in minutes!
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our professionally designed templates and customize them to match your style
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {templates.map((template) => (
            <div key={template.id} className="group transform transition-all duration-300 hover:-translate-y-2">
              <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className={`w-full h-full ${template.color} ${template.darkColor} bg-opacity-20 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105`}>
                  <div className="text-center transition-opacity duration-300 group-hover:opacity-80">
                    <div className="text-4xl mb-2 text-gray-800 dark:text-gray-100">{template.name}</div>
                    <div className="text-gray-600 dark:text-gray-300">Template</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <Link
                      to={`/create?template=${template.id}`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 text-[#2c3e50] dark:text-gray-800 bg-white dark:bg-gray-200 rounded-full font-semibold hover:bg-[#FFCFB3] dark:hover:bg-[#FFCFB3] transition-all duration-200 group-hover:shadow-lg"
                    >
                      Use This Template
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#2c3e50] dark:text-white mb-1 group-hover:text-[#E78F81] transition-colors duration-200">{template.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{template.description}</p>
            </div>
          ))}
        </div>

        {/* Features Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center transform transition-transform hover:scale-105 duration-300">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="font-semibold text-[#2c3e50] dark:text-white mb-2">ATS-friendly professionally designed</h3>
            <p className="text-gray-600 dark:text-gray-400">Tested with major ATS systems</p>
          </div>
          <div className="text-center transform transition-transform hover:scale-105 duration-300">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="font-semibold text-[#2c3e50] dark:text-white mb-2">Customizable designs</h3>
            <p className="text-gray-600 dark:text-gray-400">Change fonts, colors and layouts</p>
          </div>
          <div className="text-center transform transition-transform hover:scale-105 duration-300">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="font-semibold text-[#2c3e50] dark:text-white mb-2">Multiple format support</h3>
            <p className="text-gray-600 dark:text-gray-400">Download in PDF, Word, or TXT</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link
            to="/templates"
            className="group inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#E78F81] dark:bg-[#d36e62] rounded-full hover:bg-[#d36e62] dark:hover:bg-[#c65c50] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Browse All Templates
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TemplateShowcase; 