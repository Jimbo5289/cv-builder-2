import { Link } from 'react-router-dom';
import PricingSection from '../components/PricingSection';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2c3e50] to-[#3498db] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Create Your Perfect CV</h1>
            <p className="text-xl mb-8">
              Professional CV builder with AI-powered optimization and ATS-friendly formatting
            </p>
            <Link
              to="/create"
              className="inline-block bg-[#E78F81] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#d36e62] transition-colors duration-200"
            >
              Build My CV
            </Link>
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

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="bg-[#2c3e50] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Perfect CV?</h2>
          <p className="text-xl mb-8">Join thousands of professionals who have landed their dream jobs</p>
          <Link
            to="/create"
            className="inline-block bg-[#E78F81] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#d36e62] transition-colors duration-200"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
} 