/* eslint-disable */

/**
 * @component Footer
 * @description The global footer component that appears at the bottom of every page in the application.
 * 
 * This component provides:
 * - Information about the CV Builder application
 * - Quick navigation links to key parts of the site
 * - Resources for users to learn more about creating effective CVs
 * - Social media links for connecting with the CV Builder company
 * - Copyright information
 * 
 * The footer is structured in a responsive grid layout that adjusts based on screen size:
 * - On mobile: 2 columns (stacked layout)
 * - On tablets and larger: 4 columns (side-by-side layout)
 * 
 * Each section of the footer serves a specific purpose:
 * 1. Company information - Brief description of CV Builder
 * 2. Quick Links - Navigation to important pages
 * 3. Resources - Links to helpful content for users
 * 4. Connect - Social media links (currently only LinkedIn)
 * 
 * The footer uses the application's color scheme with dark mode support.
 * 
 * @returns {JSX.Element} A responsive footer with navigation links and company information
 */
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#2c3e50] dark:bg-gray-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company information section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">CV Builder</h3>
            <p className="text-sm md:text-base text-gray-300">
              Create professional CVs that help you stand out in the job market.
            </p>
          </div>
          
          {/* Quick Links navigation section */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><Link to="/templates" className="text-gray-300 hover:text-white">Templates</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-white">Pricing</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          {/* Resources section */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Resources</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><Link to="/cv-tips" className="text-gray-300 hover:text-white">CV Tips</Link></li>
              <li><Link to="/examples" className="text-gray-300 hover:text-white">Examples</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Legal section */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Legal</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-300 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
          
          {/* Social media connections section */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Connect</h4>
            <div className="flex flex-wrap gap-6 text-sm md:text-base">
              {/* LinkedIn link - Previously had Facebook and Twitter which were removed */}
              <a href="https://www.linkedin.com/company/mycvbuilder-co-uk/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-300 text-sm">
          <div className="mb-4">
            <p className="mb-2">&copy; {new Date().getFullYear()} MyCVBuilder Ltd. All rights reserved.</p>
            <p className="mb-1">Trading as MyCVBuilder.co.uk</p>
            <p className="mb-1">Company registered in England and Wales</p>
            <p className="mb-1">Company Number: 16521310</p>
            <p>Registered Office: 4th Floor, Silverstream House, 45 Fitzroy Street, Fitzrovia, London, W1T 6EB</p>
          </div>
          <div className="flex justify-center space-x-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-gray-500">•</span>
            <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            <span className="text-gray-500">•</span>
            <Link to="/company-info" className="hover:text-white transition-colors">Company Information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 