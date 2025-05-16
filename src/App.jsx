import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthContext';
import { ServerProvider } from './context/ServerContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ServerStatusIndicator from './components/ServerStatusIndicator';

function App() {
  // Track if cookie consent is shown to add additional padding
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showServerStatus, setShowServerStatus] = useState(true);
  
  useEffect(() => {
    // Check if cookie consent is already accepted
    const hasConsent = localStorage.getItem('cookieConsent');
    setShowCookieConsent(!hasConsent);
    
    // Listen for storage events (in case cookie consent is accepted in another tab)
    const handleStorageChange = () => {
      const hasConsent = localStorage.getItem('cookieConsent');
      setShowCookieConsent(!hasConsent);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle server status change
  const handleServerStatusChange = (status) => {
    // You can display notifications here if needed
    console.log(`Server status changed to: ${status}`);
  };

  return (
    <ErrorBoundary>
      <ServerProvider>
        <AuthProvider>
          <div className={`min-h-screen bg-gray-50 flex flex-col ${showCookieConsent ? 'pb-24 md:pb-16' : ''}`}>
            <Toaster 
              position="top-right" 
              toastOptions={{
                // Responsive styling for toasts
                style: {
                  maxWidth: '90vw',
                  '@media (min-width: 640px)': {
                    maxWidth: '350px'
                  }
                }
              }}
            />
            <Header />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow">
              <AppRoutes />
            </main>
            <Footer />
            <CookieConsent onConsentChange={(hasConsent) => setShowCookieConsent(!hasConsent)} />
            {showServerStatus && <ServerStatusIndicator onStatusChange={handleServerStatusChange} />}
          </div>
        </AuthProvider>
      </ServerProvider>
    </ErrorBoundary>
  );
}

export default App;