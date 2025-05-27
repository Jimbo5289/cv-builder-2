import React, { useState, createContext, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import toast from 'react-hot-toast';

// Create a context to expose payment verification to child components
const PaymentVerificationContext = createContext({
  verifyPayment: async () => false,
  isVerifying: false,
  hasValidPayment: false,
  error: null
});

// Hook to use the payment context
export const usePaymentVerification = () => useContext(PaymentVerificationContext);

function PayPerCvProtectedRoute({ children, paymentType = 'cv-analysis' }) {
  const { isAuthenticated, user, getAuthHeader } = useAuth();
  const location = useLocation();
  const { apiUrl, isConnected } = useServer();
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const [error, setError] = useState(null);

  // Function to verify payment status
  const verifyPayment = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue');
      return false;
    }

    if (!isConnected || !apiUrl) {
      toast.error('Server connection error. Please check your connection and try again.');
      return false;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/payments/verify/${paymentType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Payment verification failed');
        toast.error(data.message || 'Payment verification failed');
        setHasValidPayment(false);
        setIsVerifying(false);
        return false;
      }

      setHasValidPayment(data.hasValidPayment);
      setIsVerifying(false);

      if (!data.hasValidPayment) {
        toast.error(data.message || 'No valid payment found. Please purchase to continue.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Error verifying payment. Please try again later.');
      toast.error('Error verifying payment. Please try again later.');
      setHasValidPayment(false);
      setIsVerifying(false);
      return false;
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Provide context to children
  return (
    <PaymentVerificationContext.Provider value={{ verifyPayment, isVerifying, hasValidPayment, error }}>
      {children}
    </PaymentVerificationContext.Provider>
  );
}

export default PayPerCvProtectedRoute; 