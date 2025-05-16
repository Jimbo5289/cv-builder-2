import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Hero() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resumeExamples = [
    { id: 1, image: "/resume-1.png", position: "-rotate-6" },
    { id: 2, image: "/resume-2.png", position: "rotate-3" },
    { id: 3, image: "/resume-3.png", position: "-rotate-3" }
  ];

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#B7E0FF]/30 to-white/0"></div>

      {/* Main Hero Content */}
      <div className="container mx-auto px-4 pt-8 md:pt-16 pb-12 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2c3e50] leading-tight mb-4 md:mb-6">
              CV Builder helps you
              <span className="text-[#E78F81] block">get hired at top companies</span>
            </h1>
            
            <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
              Create your professional CV in minutes. Choose from expert-designed templates and customize them to match your style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-12 justify-center lg:justify-start">
              <Link 
                to="/create"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 text-base md:text-lg font-semibold text-white bg-[#E78F81] rounded-full hover:bg-[#d36e62] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Build Your CV
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                to="/score"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 text-base md:text-lg font-semibold text-[#2c3e50] bg-[#FFCFB3] rounded-full hover:bg-[#fcb490] transition-all duration-200"
              >
                Get Your CV Score
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 md:space-y-4 text-center lg:text-left">
              <p className="text-xs md:text-sm font-medium text-gray-500">TRUSTED BY PROFESSIONALS FROM</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 items-center">
                <div className="text-gray-400 text-sm md:text-base font-semibold">Google</div>
                <div className="text-gray-400 text-sm md:text-base font-semibold">Apple</div>
                <div className="text-gray-400 text-sm md:text-base font-semibold">Microsoft</div>
                <div className="text-gray-400 text-sm md:text-base font-semibold">Amazon</div>
              </div>
            </div>
          </div>

          {/* Right Column - Resume Examples */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mt-8 md:mt-0">
            {isMobile ? (
              // Mobile version - single resume example
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-lg overflow-hidden bg-white">
                <div className="w-64 h-80 sm:w-72 sm:h-96 bg-gray-100 flex items-center justify-center text-gray-400">
                  Resume Example
                </div>
              </div>
            ) : (
              // Desktop version - stacked examples
              resumeExamples.map((example, index) => (
                <div
                  key={example.id}
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${example.position} transition-all duration-500 hover:scale-105 cursor-pointer shadow-2xl rounded-lg overflow-hidden bg-white`}
                  style={{
                    zIndex: resumeExamples.length - index,
                    width: '300px',
                    height: '400px'
                  }}
                >
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    Resume Example {example.id}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="bg-white py-8 md:py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="text-2xl md:text-3xl">✨</div>
              <div>
                <h3 className="font-semibold text-[#2c3e50] text-sm md:text-base">ATS-friendly design</h3>
                <p className="text-gray-600 text-xs md:text-sm">Optimized for all major ATS systems</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="text-2xl md:text-3xl">🎯</div>
              <div>
                <h3 className="font-semibold text-[#2c3e50] text-sm md:text-base">Smart CV Checker</h3>
                <p className="text-gray-600 text-xs md:text-sm">Get instant feedback and tips</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 sm:col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl">⚡</div>
              <div>
                <h3 className="font-semibold text-[#2c3e50] text-sm md:text-base">Ready in minutes</h3>
                <p className="text-gray-600 text-xs md:text-sm">Quick and easy to customize</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero; 