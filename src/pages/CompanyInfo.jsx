/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';

const CompanyInfo = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-6">Company Information</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">MyCVBuilder Ltd</h2>
        <p className="text-sm text-gray-600 mb-4">Trading as MyCVBuilder.co.uk</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#2c3e50] mb-3">Company Registration</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Company Name:</strong> MyCVBuilder Ltd</p>
              <p><strong>Trading Name:</strong> MyCVBuilder.co.uk</p>
              <p><strong>Company Number:</strong> 16521310</p>
              <p><strong>Business Start Date:</strong> 1st July 2025</p>
              <p><strong>Company Type:</strong> Private limited company</p>
              <p><strong>Jurisdiction:</strong> England and Wales</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#2c3e50] mb-3">Registered Office</h3>
            <div className="text-gray-700">
              <p className="mb-2"><strong>Address:</strong></p>
              <div className="pl-4">
                <p>MyCVBuilder Ltd</p>
                <p>4th Floor, Silverstream House</p>
                <p>45 Fitzroy Street, Fitzrovia</p>
                <p>London, W1T 6EB</p>
                <p>England</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-[#2c3e50] mb-3">Business Information</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Nature of Business:</strong> Online CV building platform and career services</p>
            <p><strong>VAT Status:</strong> Not currently VAT registered (will register when threshold is met)</p>
            <p><strong>Standard Industrial Classification (SIC):</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>62012</strong> - Business and domestic software development</li>
              <li><strong>63120</strong> - Web portals</li>
              <li><strong>74909</strong> - Other professional, scientific and technical activities</li>
              <li><strong>85590</strong> - Other education n.e.c.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-[#2c3e50] mb-3">Contact Information</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> 
              <a href="mailto:support@mycvbuilder.co.uk" className="text-[#2c3e50] font-medium ml-1 hover:underline">
                support@mycvbuilder.co.uk
              </a>
            </p>
            <p><strong>Website:</strong> 
              <a href="https://mycvbuilder.co.uk" className="text-[#2c3e50] font-medium ml-1 hover:underline">
                mycvbuilder.co.uk
              </a>
            </p>
            <p><strong>Customer Support:</strong> 
              <Link to="/contact" className="text-[#2c3e50] font-medium ml-1 hover:underline">
                Contact Form
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-[#2c3e50] mb-3">Regulatory Information</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Data Protection Registration:</strong> Registered with the ICO (Information Commissioner's Office)</p>
            <p><strong>Companies House:</strong> 
              <a 
                href="https://find-and-update.company-information.service.gov.uk/company/16521310" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#2c3e50] font-medium ml-1 hover:underline"
              >
                View our public filing information
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-[#2c3e50] mb-3">Legal and Compliance</h3>
          <div className="space-y-2 text-gray-700">
            <p>MyCVBuilder Ltd is committed to operating in full compliance with UK law and regulations, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>The Companies Act 2006</li>
              <li>The General Data Protection Regulation (GDPR)</li>
              <li>The Data Protection Act 2018</li>
              <li>The Electronic Commerce Regulations 2002</li>
              <li>The Consumer Rights Act 2015</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
          <p className="mb-2">
            <strong>Important:</strong> This information is provided for transparency and legal compliance purposes.
          </p>
          <p>
            For the most up-to-date company information, please check our 
            <a 
              href="https://find-and-update.company-information.service.gov.uk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#2c3e50] font-medium ml-1 hover:underline"
            >
              Companies House filing
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo; 