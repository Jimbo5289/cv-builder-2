import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = ({ onConsentChange }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show the cookie banner after a short delay
      const timer = setTimeout(() => {
        setVisible(true);
        // Add padding to the bottom of the page when banner is visible
        document.body.style.paddingBottom = '88px'; // Adjust this value based on banner height
        if (onConsentChange) onConsentChange(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (onConsentChange) {
      onConsentChange(true);
    }
  }, [onConsentChange]);

  const handleConsentChange = (accepted) => {
    // Save consent in localStorage
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
    setVisible(false);
    // Remove padding when banner is hidden
    document.body.style.paddingBottom = '0';
    if (onConsentChange) onConsentChange(true);
  };

  const acceptCookies = () => {
    handleConsentChange(true);
  };

  const declineCookies = () => {
    // In a real implementation, you'd disable non-essential cookies here
    handleConsentChange(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 md:flex md:items-center md:justify-between">
        <div className="md:flex-1 md:pr-6">
          <p className="text-sm text-gray-700">
            We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept", you consent to our use of cookies.
            <Link to="/cookie-policy" className="text-[#2c3e50] font-medium ml-1 hover:underline">
              Read our Cookie Policy
            </Link>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={declineCookies}
            className="flex-shrink-0 text-sm bg-gray-200 px-4 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="flex-shrink-0 text-sm bg-[#2c3e50] px-4 py-2 rounded-md font-medium text-white hover:bg-[#1f2b38] focus:outline-none focus:ring-2 focus:ring-[#2c3e50]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 