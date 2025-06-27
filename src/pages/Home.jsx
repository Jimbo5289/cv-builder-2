/* eslint-disable */
import { Link } from 'react-router-dom';
import { FiFileText, FiBriefcase, FiTarget, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

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
              <p className="text-lg md:text-xl mb-6 text-blue-100 max-w-lg leading-relaxed">
                Professional CV builder with AI-powered optimization and ATS-friendly formatting. Get past hiring robots and land interviews 3x faster.
              </p>

              {/* Value proposition badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                <div className="bg-green-500 bg-opacity-20 border border-green-400 text-green-100 px-3 py-1 rounded-full text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free to Start
                </div>
                <div className="bg-yellow-500 bg-opacity-20 border border-yellow-400 text-yellow-100 px-3 py-1 rounded-full text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  5-Minute Setup
                </div>
                <div className="bg-blue-500 bg-opacity-20 border border-blue-400 text-blue-100 px-3 py-1 rounded-full text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Download Instantly
                </div>
              </div>

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

              <p className="text-blue-200 text-sm mt-4 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Join 10,000+ professionals who've already boosted their careers
              </p>
            </div>
            
            {/* Right column - Analysis options */}
            <div className="md:w-1/2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-10">
              <h2 className="text-xl font-semibold mb-4 text-center">Enhance Your CV with AI Analysis</h2>
              <div className="grid gap-3">
                <Link
                  to="/cv-analyze"
                  className="flex items-center justify-between bg-[#2ecc71] bg-opacity-80 hover:bg-opacity-100 p-4 rounded-xl transition-all duration-200 group hover:shadow-md"
                  state={{ fromHome: true }}
                >
                  <div className="flex items-start">
                    <div className="text-white bg-green-600 p-2 rounded-lg mr-3 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Analyze CV Only</span>
                      <p className="text-sm text-green-100">Get general feedback on your CV</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs bg-yellow-400 text-[#2c3e50] px-2 py-0.5 rounded-full font-bold mr-2">
                      PREMIUM
                    </span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </Link>
                
                <Link
                  to="/cv-analyze-by-role"
                  className="flex items-center justify-between bg-[#9b59b6] bg-opacity-80 hover:bg-opacity-100 p-4 rounded-xl transition-all duration-200 group hover:shadow-md"
                  state={{ fromHome: true }}
                >
                  <div className="flex items-start">
                    <div className="text-white bg-purple-700 p-2 rounded-lg mr-3 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Industry-Focused Analysis</span>
                      <p className="text-sm text-purple-100">Optimize for specific career fields</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs bg-yellow-400 text-[#2c3e50] px-2 py-0.5 rounded-full font-bold mr-2">
                      PREMIUM
                    </span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </Link>
                
                <Link
                  to="/analyze"
                  className="flex items-center justify-between bg-[#3498db] bg-opacity-80 hover:bg-opacity-100 p-4 rounded-xl transition-all duration-200 group hover:shadow-md"
                  state={{ fromHome: true }}
                >
                  <div className="flex items-start">
                    <div className="text-white bg-blue-600 p-2 rounded-lg mr-3 mt-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Analyze with Job</span>
                      <p className="text-sm text-blue-100">Match your CV to specific job openings</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs bg-yellow-400 text-[#2c3e50] px-2 py-0.5 rounded-full font-bold mr-2">
                      PREMIUM
                    </span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
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
        </div>
      </section>

      {/* Template Showcase Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c3e50] dark:text-white mb-4">
              Choose from Industry-Specific Templates
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Each template is professionally designed for specific career paths and optimized to pass ATS systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                id: 1,
                name: "Professional",
                color: "#4A90E2",
                image: "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=400&h=600&fit=crop&crop=center",
                description: "Corporate & Business",
                features: ["Clean layout", "ATS-friendly", "Traditional sectors"]
              },
              {
                id: 2,
                name: "Creative",
                color: "#E24A8B", 
                image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=600&fit=crop&crop=center",
                description: "Design & Marketing",
                features: ["Visual sidebar", "Portfolio section", "Creative industries"]
              },
              {
                id: 3,
                name: "Executive",
                color: "#4AE2C4",
                image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=600&fit=crop&crop=center",
                description: "Leadership & Management",
                features: ["Two-column layout", "Achievement focus", "Senior positions"]
              },
              {
                id: 4,
                name: "Academic",
                color: "#E2A64A",
                image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center",
                description: "Research & Academia",
                features: ["Publications", "Research focus", "Academic roles"]
              }
            ].map((template) => (
              <div key={template.id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={template.image}
                    alt={`${template.name} CV Template - ${template.description} resume design`}
                    className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <Link
                        to={`/create?template=${template.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 text-sm"
                        style={{ backgroundColor: template.color }}
                      >
                        Use Template
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span 
                      className="px-2 py-1 rounded-full text-white font-medium text-xs shadow-lg"
                      style={{ backgroundColor: template.color }}
                    >
                      {template.name}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#2c3e50] dark:text-white mb-1 group-hover:text-opacity-80 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {template.description}
                  </p>
                  <div className="space-y-1">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <div 
                          className="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0"
                          style={{ backgroundColor: template.color }}
                        ></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/templates"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#E78F81] rounded-full hover:bg-[#d36e62] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Templates
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof and Success Metrics Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c3e50] dark:text-white mb-4">
              Professional CV Builder Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Industry-standard tools and templates designed to help you create outstanding CVs
            </p>
          </div>

          {/* Platform Features - COMMENTED OUT until we have verified data */}
          {/*
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#E78F81] mb-2">4</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Template Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#3498db] mb-2">AI</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Powered Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#2ecc71] mb-2">ATS</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Optimized</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#9b59b6] mb-2">Free</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">To Start</div>
            </div>
          </div>
          */

          {/* Testimonials - COMMENTED OUT until we have real customer feedback */}
          {/* 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-[#2c3e50] dark:text-white">Mike Johnson</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Software Engineer</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                "The AI analysis helped me identify gaps in my CV I never noticed. Got 3 interviews in 2 weeks!"
              </p>
              <div className="flex text-yellow-400 mt-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-[#2c3e50] dark:text-white">Sarah Chen</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Marketing Manager</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                "The Creative template perfectly showcased my portfolio. Landed my dream job at a top agency!"
              </p>
              <div className="flex text-yellow-400 mt-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  D
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-[#2c3e50] dark:text-white">Dr. Alex Kumar</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Research Scientist</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                "The Academic template highlighted my publications perfectly. Secured a position at Cambridge!"
              </p>
              <div className="flex text-yellow-400 mt-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          */}

          {/* Trust Indicators - Only keeping factual, verifiable claims */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 mb-8 opacity-60">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure & Private
              </div>
              {/* Commented out unverified claims until we can substantiate them */}
              {/*
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ATS Tested
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                HR Approved
              </div>
              */}
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Mobile Optimized
              </div>
            </div>
            
            <div className="inline-flex items-center bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-6 py-3 rounded-full">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Start building your professional CV today - It's free to begin!</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
