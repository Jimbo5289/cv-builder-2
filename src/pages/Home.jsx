import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#2c3e50] to-[#3498db] text-white py-16 md:py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 lg:w-64 lg:h-64 rounded-full bg-blue-400 bg-opacity-20 blur-3xl"></div>
          <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-purple-400 bg-opacity-10 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-yellow-400 bg-opacity-10 blur-xl"></div>
          
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left column - Text content */}
            <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
              <div className="inline-block px-3 py-1 bg-blue-900 bg-opacity-50 rounded-full text-blue-200 text-sm font-medium mb-4">
                Professional CV Builder
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
                Create Your <span className="text-[#E78F81]">Perfect CV</span>
                <br className="hidden md:block" /> That Stands Out
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-lg leading-relaxed">
                Professional CV builder with AI-powered optimization and ATS-friendly formatting to help you land your dream job.
              </p>

              {/* Primary CTA Button */}
              <div className="mb-6 flex justify-center md:justify-start">
                <Link
                  to="/create"
                  className="group inline-block bg-[#E78F81] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#d36e62] transition-all duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Build My CV
                  <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>

              <p className="text-blue-200 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Join 10,000+ professionals who've boosted their careers
              </p>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  AI-Powered
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                  ATS-Optimized
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                  Modern Templates
                </span>
              </div>
            </div>
            
            {/* Right column - Analysis options */}
            <div className="md:w-1/2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-10">
              <h2 className="text-xl font-semibold mb-4 text-center">Enhance Your CV with AI Analysis</h2>
              <div className="grid gap-6">
                <Link
                  to="/cv-analyse"
                  className="flex items-center justify-between bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
                  state={{ fromHome: true }}
                >
                  <div className="flex items-center">
                    <div className="bg-white text-green-600 p-3 rounded-full shadow-md mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Analyse CV Only</h3>
                      <p className="text-sm">Get general feedback on your CV</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/cv-analyse-by-role"
                  className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
                  state={{ fromHome: true }}
                >
                  <div className="flex items-center">
                    <div className="bg-white text-blue-600 p-3 rounded-full shadow-md mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Industry Focused Analysis</h3>
                      <p className="text-sm">Analyze your CV for industry-specific roles</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/analyse"
                  className="flex items-center justify-between bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
                  state={{ fromHome: true }}
                >
                  <div className="flex items-center">
                    <div className="bg-white text-purple-600 p-3 rounded-full shadow-md mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Analyse with JDPS</h3>
                      <p className="text-sm">Match your CV to specific job openings</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#B7E0FF] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2c3e50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">ATS-Optimized</h3>
              <p className="text-gray-600">Get past applicant tracking systems with our optimized formatting</p>
            </div>
            <div className="text-center">
              <div className="bg-[#B7E0FF] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2c3e50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Templates</h3>
              <p className="text-gray-600">Choose from a variety of modern, professional templates</p>
            </div>
            <div className="text-center">
              <div className="bg-[#B7E0FF] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2c3e50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-600">Get personalized suggestions and optimizations</p>
            </div>
          </div>

          {/* Premium Feature Highlight */}
          <div className="mt-16 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-[#2c3e50]">Job-Tailored CV Analysis</h3>
                    <span className="inline-block bg-yellow-400 text-[#2c3e50] px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                      PREMIUM FEATURE
                    </span>
                  </div>
                  <p className="text-gray-700 mb-6">
                    Our advanced AI analyses your CV against specific job descriptions to provide tailored recommendations. Stand out from other applicants by perfectly matching your CV to each job you apply for.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                      Job-Specific Keywords
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                      Skills Gap Analysis
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                      ATS Compatibility Score
                    </div>
                  </div>
                  <Link
                    to="/analyse" 
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                    aria-label="Try CV analysis with job matching"
                    state={{ fromHome: true }}
                  >
                    Try it now
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <svg className="w-64 h-64 text-blue-100" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216v96H40ZM40,200V168H216v32Z"></path>
                    <path d="M184,180a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,180Zm32-84a12,12,0,1,1-12-12A12,12,0,0,1,216,96Zm-32,0a12,12,0,1,1-12-12A12,12,0,0,1,184,96Zm-32,0a12,12,0,1,1-12-12A12,12,0,0,1,152,96Z"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-24 h-24 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Standalone CV Analysis Feature */}
          <div className="mt-8 mb-16 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/2 flex justify-center order-2 md:order-1">
                <div className="relative">
                  <svg className="w-64 h-64 text-teal-100" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                    <path d="M171.31,156.69A8,8,0,0,1,168,168H88a8,8,0,0,1,0-16h80A8,8,0,0,1,171.31,156.69ZM168,184H88a8,8,0,0,0,0,16h80a8,8,0,0,0,0-16ZM88,104h16a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16Z"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-24 h-24 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-6 order-1 md:order-2">
                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-[#2c3e50]">CV Quality Analysis</h3>
                    <span className="inline-block bg-yellow-400 text-[#2c3e50] px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                      PREMIUM FEATURE
                    </span>
                  </div>
                  <p className="text-gray-700 mb-6">
                    Get instant feedback on your CV without a specific job in mind. Our AI analyzes your CV's format, content, and keywords to ensure it's optimized for ATS systems and meets industry standards.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                      ATS Compatibility
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                      Format & Content Score
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                      Actionable Recommendations
                    </div>
                  </div>
                  <Link
                    to="/cv-analyse"
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                    aria-label="Try standalone CV analysis"
                    state={{ fromHome: true }}
                  >
                    Try it now
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
