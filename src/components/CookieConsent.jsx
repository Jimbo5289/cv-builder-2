/* eslint-disable */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';

const CookieConsent = ({ onConsentChange }) => {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user, getAuthHeader, isAuthenticated } = useAuth();
  const { apiUrl } = useServer();

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

  const saveConsentToDatabase = async (accepted) => {
    // Only save to database if user is authenticated
    if (!isAuthenticated || !user || !apiUrl) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${apiUrl}/api/users/consent`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          marketingConsent: accepted,
          cookieConsent: accepted ? 'accepted' : 'declined',
          consentTimestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.error('Failed to save consent to database:', response.status);
      } else {
        console.log('Cookie consent saved to database:', accepted);
      }
    } catch (error) {
      console.error('Error saving consent to database:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleConsentChange = async (accepted) => {
    // Save consent in localStorage immediately
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
    setVisible(false);
    // Remove padding when banner is hidden
    document.body.style.paddingBottom = '0';
    
    // Also save to database for marketing purposes
    await saveConsentToDatabase(accepted);
    
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
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies and agree to receive marketing communications.
            <Link to="/cookie-policy" className="text-[#2c3e50] font-medium ml-1 hover:underline">
              Read our Cookie Policy
            </Link>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={declineCookies}
            disabled={saving}
            className={`flex-shrink-0 text-sm bg-gray-200 px-4 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            disabled={saving}
            className={`flex-shrink-0 text-sm bg-[#2c3e50] px-4 py-2 rounded-md font-medium text-white hover:bg-[#1f2b38] focus:outline-none focus:ring-2 focus:ring-[#2c3e50] ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving...' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 