import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-6">Cookie Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Last Updated: May 15, 2025</h2>
        <p className="mb-4 text-gray-700">
          This Cookie Policy explains how CV Builder ("we", "us", or "our") uses cookies and similar tracking technologies on our website. This policy is part of our 
          <Link to="/privacy-policy" className="text-[#2c3e50] font-medium mx-1 hover:underline">
            Privacy Policy
          </Link>
          and helps you understand what cookies are, why we use them, and what choices you have regarding their use.
        </p>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">What Are Cookies?</h3>
        <p className="mb-4 text-gray-700">
          Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit websites. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies cannot harm your device or access other information on your device.
        </p>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Types of Cookies We Use</h3>
        <div className="mb-4">
          <h4 className="font-medium text-[#2c3e50] mb-2">Essential Cookies</h4>
          <p className="text-gray-700 mb-2">
            These cookies are necessary for the website to function properly. They enable core functionality such as security, account management, and remembering your preferences. You cannot opt out of these cookies.
          </p>
          <p className="text-gray-600 text-sm italic">Example: Authentication cookies that keep you logged in during your visit.</p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-[#2c3e50] mb-2">Performance & Analytics Cookies</h4>
          <p className="text-gray-700 mb-2">
            These cookies collect information about how you use our website, which pages you visit, and if you experience any errors. We use this data to improve our website and services. All information these cookies collect is aggregated and anonymous.
          </p>
          <p className="text-gray-600 text-sm italic">Example: Google Analytics cookies that help us understand how you interact with our website.</p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-[#2c3e50] mb-2">Functional Cookies</h4>
          <p className="text-gray-700 mb-2">
            These cookies allow the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
          </p>
          <p className="text-gray-600 text-sm italic">Example: Cookies that remember your CV template preferences.</p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-[#2c3e50] mb-2">Targeting & Advertising Cookies</h4>
          <p className="text-gray-700 mb-2">
            These cookies are used to track visitors across websites. They are used to display ads that are relevant and engaging for individual users.
          </p>
          <p className="text-gray-600 text-sm italic">Example: Cookies used by advertising partners to build a profile of your interests.</p>
        </div>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Third-Party Cookies</h3>
        <p className="mb-4 text-gray-700">
          In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements, and so on. These cookies may include:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li>Google Analytics</li>
          <li>Stripe (for payment processing)</li>
          <li>Social media platforms (if you use social login features)</li>
        </ul>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Managing Cookies</h3>
        <p className="mb-3 text-gray-700">
          Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience. Below are links to manage cookies in common browsers:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#2c3e50] hover:underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-[#2c3e50] hover:underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#2c3e50] hover:underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#2c3e50] hover:underline">Microsoft Edge</a></li>
        </ul>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Your Consent</h3>
        <p className="mb-4 text-gray-700">
          When you first visit our website, we'll ask for your consent to use cookies through a cookie banner. You can choose to accept or decline cookies. If you decline, essential cookies will still be used, but other types of cookies will be disabled.
        </p>
        <p className="mb-4 text-gray-700">
          You can change your cookie preferences at any time by clicking the "Cookie Settings" button below.
        </p>

        <div className="mt-6">
          <button 
            onClick={() => {
              // Clear consent and reload
              localStorage.removeItem('cookieConsent');
              window.location.reload();
            }}
            className="bg-[#2c3e50] text-white px-4 py-2 rounded-md hover:bg-[#1f2b38] transition"
          >
            Cookie Settings
          </button>
        </div>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-8 mb-3">Changes to This Cookie Policy</h3>
        <p className="mb-4 text-gray-700">
          We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
        </p>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Contact Us</h3>
        <p className="text-gray-700">
          If you have any questions about our Cookie Policy, please contact us at:
          <a href="mailto:privacy@cvbuilder.com" className="text-[#2c3e50] font-medium ml-1 hover:underline">
            privacy@cvbuilder.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy; 