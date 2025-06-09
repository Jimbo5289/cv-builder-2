/* eslint-disable */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { FiLock, FiCheck, FiAlertCircle, FiInfo, FiWifi, FiWifiOff } from 'react-icons/fi';

export default function TwoFactorSetup() {
  const [step, setStep] = useState('loading'); // loading, initial, setup, verify, success, disabled
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const { getAuthHeader } = useAuth();
  const { apiUrl, isConnected, status: connectionStatus } = useServer();

  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  const mockSubscription = import.meta.env.VITE_MOCK_SUBSCRIPTION_DATA === 'true';

  // Update server status when connection status changes
  useEffect(() => {
    if (connectionStatus === 'connected' || isConnected) {
      setServerStatus('online');
    } else if (connectionStatus === 'disconnected') {
      setServerStatus('offline');
    } else {
      setServerStatus('checking');
    }
    
    // Force online in development mode with mock subscription
    if (isDevelopment && mockSubscription) {
      setServerStatus('online');
    }
  }, [connectionStatus, isConnected, isDevelopment, mockSubscription]);

  // Define checkTwoFactorStatus using useCallback
  const checkTwoFactorStatus = useCallback(async () => {
    if (serverStatus !== 'online') {
      setError('Cannot connect to server. Please try again later.');
      setStep('initial');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');

      // In development mode with mock enabled, simulate a response
      if (isDevelopment && mockSubscription) {
        console.log('DEV MODE: Simulating 2FA status check');
        // Simulate server response time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate a response
        const mockEnabled = localStorage.getItem('mock_2fa_enabled') === 'true';
        setStep(mockEnabled ? 'disabled' : 'initial');
        setIsLoading(false);
        return;
      }

      // Normal server call
      const response = await fetch(`${apiUrl}/api/2fa/status`, {
        method: 'GET',
        headers: getAuthHeader(),
      }).catch(err => {
        console.error('Network error during 2FA status check:', err);
        throw new Error('Network error. Unable to connect to server.');
      });

      if (!response.ok) {
        // If we're in development mode but 2FA API doesn't exist yet, allow mock flow
        if (isDevelopment && (response.status === 404 || response.status === 401)) {
          console.log('DEV MODE: 2FA API not implemented, using mock mode');
          localStorage.setItem('mock_2fa_enabled', 'false');
          setStep('initial');
          setIsLoading(false);
          return;
        }
        
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Error response from 2FA status check:', response.status, errorText);
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const data = await response.json().catch(err => {
        console.error('Error parsing 2FA status response:', err);
        throw new Error('Invalid server response');
      });
      
      if (data.twoFactorEnabled) {
        setStep('disabled');
      } else {
        setStep('initial');
      }
    } catch (err) {
      console.error('Error checking 2FA status:', err);
      
      // Handle error gracefully in dev mode
      if (isDevelopment) {
        console.log('DEV MODE: Continuing with mock 2FA flow despite error');
        setStep('initial');
        setError('Using development 2FA flow (mock mode)');
      } else {
        setStep('initial'); // Fallback to initial step
        setError(`Unable to check 2FA status: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [serverStatus, isDevelopment, apiUrl, getAuthHeader, mockSubscription]);

  // Effect for checking server connectivity
  useEffect(() => {
    // Update server status based on ServerContext
    if (isDevelopment && mockSubscription) {
      console.log('DEV MODE: Using mock 2FA functionality');
      // In development, we can simulate an online server
      setServerStatus('online');
    } else {
      setServerStatus(isConnected ? 'online' : 'offline');
    }
  }, [isConnected, isDevelopment, mockSubscription]);

  // Check if 2FA is already enabled when component mounts
  useEffect(() => {
    if (serverStatus === 'online') {
      checkTwoFactorStatus();
    }
  }, [serverStatus, checkTwoFactorStatus]);

  const initiate2FASetup = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // For development mode with mock enabled
      if (isDevelopment && mockSubscription) {
        console.log('DEV MODE: Simulating 2FA setup');
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Mock QR code and secret
        setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/CVBuilder:dev@example.com?secret=JBSWY3DPEHPK3PXP&issuer=CVBuilder');
        setSecret('JBSWY3DPEHPK3PXP');
        setStep('setup');
        setIsLoading(false);
        return;
      }
      
      // Regular server call
      const response = await fetch(`${apiUrl}/api/2fa/setup`, {
        method: 'POST',
        headers: getAuthHeader(),
      });

      // If the API doesn't exist in development, simulate it
      if (isDevelopment && (response.status === 404 || response.status === 401)) {
        console.log('DEV MODE: 2FA setup API not implemented, using mock mode');
        // Mock QR code and secret
        setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/CVBuilder:dev@example.com?secret=JBSWY3DPEHPK3PXP&issuer=CVBuilder');
        setSecret('JBSWY3DPEHPK3PXP');
        setStep('setup');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to setup 2FA');
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep('setup');
    } catch (err) {
      // Handle error gracefully in dev mode
      if (isDevelopment) {
        console.log('DEV MODE: Using mock 2FA setup despite error');
        setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/CVBuilder:dev@example.com?secret=JBSWY3DPEHPK3PXP&issuer=CVBuilder');
        setSecret('JBSWY3DPEHPK3PXP');
        setStep('setup');
      } else {
        setError(err.message || 'An error occurred during 2FA setup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');

      // For development mode with mock enabled
      if (isDevelopment && mockSubscription) {
        console.log('DEV MODE: Simulating 2FA verification');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In dev mode, accept any 6-digit code
        if (token.length === 6 && /^\d{6}$/.test(token)) {
          localStorage.setItem('mock_2fa_enabled', 'true');
          setStep('success');
        } else {
          setError('Invalid verification code. Please enter a 6-digit code.');
        }
        
        setIsLoading(false);
        return;
      }

      // Regular server call
      const response = await fetch(`${apiUrl}/api/2fa/verify`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      // If the API doesn't exist in development, simulate it
      if (isDevelopment && (response.status === 404 || response.status === 401)) {
        console.log('DEV MODE: 2FA verify API not implemented, using mock mode');
        if (token.length === 6 && /^\d{6}$/.test(token)) {
          localStorage.setItem('mock_2fa_enabled', 'true');
          setStep('success');
        } else {
          setError('Invalid verification code. Please enter a 6-digit code.');
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify 2FA');
      }

      setStep('success');
    } catch (err) {
      // Handle error gracefully in dev mode
      if (isDevelopment && mockSubscription) {
        console.log('DEV MODE: Using mock 2FA verification despite error');
        if (token.length === 6 && /^\d{6}$/.test(token)) {
          localStorage.setItem('mock_2fa_enabled', 'true');
          setStep('success');
        } else {
          setError('Invalid verification code. Please enter a 6-digit code.');
        }
      } else {
        setError(err.message || 'Invalid verification code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async () => {
    // For development mode with mock enabled
    if (isDevelopment && mockSubscription) {
      console.log('DEV MODE: Simulating 2FA disable verification step');
      setStep('verifyDisable');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');

      // Request verification code before disabling
      setStep('verifyDisable');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDisable2FA = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');

      // For development mode with mock enabled
      if (isDevelopment && mockSubscription) {
        console.log('DEV MODE: Simulating 2FA disable');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In dev mode, accept any 6-digit code
        if (token.length === 6 && /^\d{6}$/.test(token)) {
          localStorage.removeItem('mock_2fa_enabled');
          setToken('');
          setStep('initial');
        } else {
          setError('Invalid verification code. Please enter a 6-digit code.');
        }
        
        setIsLoading(false);
        return;
      }

      // Regular server call
      const response = await fetch(`${apiUrl}/api/2fa/disable`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      // If the API doesn't exist in development, simulate it
      if (isDevelopment && (response.status === 404 || response.status === 401)) {
        console.log('DEV MODE: 2FA disable API not implemented, using mock mode');
        if (token.length === 6 && /^\d{6}$/.test(token)) {
          localStorage.removeItem('mock_2fa_enabled');
          setToken('');
          setStep('initial');
        } else {
          setError('Invalid verification code. Please enter a 6-digit code.');
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to disable 2FA');
      }

      setToken('');
      setStep('initial');
    } catch (err) {
      // Handle error gracefully in dev mode
      if (isDevelopment && mockSubscription) {
        console.log('DEV MODE: Using mock 2FA disable despite error');
        if (token.length === 6 && /^\d{6}$/.test(token)) {
          localStorage.removeItem('mock_2fa_enabled');
          setToken('');
          setStep('initial');
        } else {
          setError('Invalid verification code. Please enter a 6-digit code.');
        }
      } else {
        setError(err.message || 'Invalid verification code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      // Reset the "Copied!" message after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (serverStatus === 'offline') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <FiWifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Server Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're unable to connect to the server right now. Two-factor authentication features require a connection to the server.
          </p>
          <button
            onClick={() => setServerStatus('checking')}
            className="bg-[#E78F81] text-white py-2 px-4 rounded-md hover:bg-[#d36e62] transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E78F81] dark:border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (step === 'initial') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4 text-[#E78F81] dark:text-blue-500">
          <FiLock className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">Two-Factor Authentication</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Enhance your account security by enabling two-factor authentication. 
          This adds an extra layer of protection by requiring a code from your 
          mobile authenticator app when signing in.
        </p>
        <button
          onClick={initiate2FASetup}
          disabled={isLoading}
          className="w-full bg-[#E78F81] text-white py-2 px-4 rounded-md hover:bg-[#d36e62] transition-colors duration-200 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {isLoading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md flex items-start">
            <FiAlertCircle className="text-red-600 dark:text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-red-600 dark:text-red-500">{error}</p>
              {error.includes('connect to server') && isDevelopment && (
                <div className="mt-2 text-gray-600 dark:text-gray-400">
                  <p className="font-medium">Development Mode:</p>
                  <ol className="list-decimal ml-5 mt-1 space-y-1">
                    <li>Use email <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">2fa-test@example.com</code> with password <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Test@123</code> for testing</li>
                    <li>Any 6-digit code will work in development mode</li>
                    <li>2FA settings will be stored in local storage</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Set Up Authenticator App</h2>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
          <ol className="text-gray-600 dark:text-gray-300 list-decimal pl-5 space-y-2">
            <li>Install an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy on your mobile device</li>
            <li>Open the authenticator app and scan this QR code</li>
            <li>Enter the 6-digit verification code shown in your app</li>
          </ol>
        </div>
        <div className="mb-6 flex justify-center bg-white p-3 rounded-lg">
          <img src={qrCode} alt="2FA QR Code" className="border dark:border-gray-600 p-2 rounded-lg" style={{ maxWidth: '200px', height: 'auto' }} />
        </div>
        <form onSubmit={verify2FA} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Verification Code
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').substring(0, 6))}
              placeholder="Enter 6-digit code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              pattern="[0-9]{6}"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading || token.length !== 6}
            className="w-full bg-[#E78F81] text-white py-2 px-4 rounded-md hover:bg-[#d36e62] transition-colors duration-200 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md flex items-start">
            <FiAlertCircle className="text-red-600 dark:text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
          </div>
        )}
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Can't scan the QR code? 
            </p>
            <button
              onClick={copyToClipboard}
              className="ml-2 p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-[#E78F81] dark:focus:ring-blue-500 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <span className="text-xs flex items-center text-green-600 dark:text-green-400 font-medium px-1">
                  <FiCheck className="h-3 w-3 mr-1" />
                  Copied
                </span>
              ) : (
                <span className="text-xs font-medium px-1">Copy code</span>
              )}
            </button>
          </div>
          <div className="overflow-x-auto relative">
            <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm break-all overflow-x-auto whitespace-normal text-gray-800 dark:text-gray-200">
              {secret}
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-4">
            <FiCheck className="h-full w-full" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            2FA Enabled Successfully
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your account is now protected with two-factor authentication.
            You'll need to provide a verification code each time you sign in.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6 flex items-start">
            <FiInfo className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 text-left">
                <strong>Important:</strong> Store your secret key in a safe place. If you lose access to your 
                authenticator app, you'll need this key to regain access to your account.
              </p>
              <code className="block mt-2 p-2 bg-white dark:bg-gray-700 rounded text-xs break-all overflow-x-auto whitespace-normal text-gray-800 dark:text-gray-200">
                {secret}
              </code>
            </div>
          </div>
          <button
            onClick={() => setStep('disabled')}
            className="bg-[#E78F81] text-white py-2 px-4 rounded-md hover:bg-[#d36e62] transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (step === 'disabled') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4 text-green-600 dark:text-green-500">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
            <FiCheck className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">Two-Factor Authentication Enabled</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Your account is protected with two-factor authentication. You'll need to enter a verification code 
          from your authenticator app each time you sign in.
        </p>
        <button
          onClick={disable2FA}
          disabled={isLoading}
          className="w-full border border-red-300 text-red-600 bg-white py-2 px-4 rounded-md hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 dark:bg-transparent dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
        >
          {isLoading ? 'Processing...' : 'Disable Two-Factor Authentication'}
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md flex items-start">
            <FiAlertCircle className="text-red-600 dark:text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
          </div>
        )}
      </div>
    );
  }

  if (step === 'verifyDisable') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Disable Two-Factor Authentication</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          To disable two-factor authentication, please enter the verification code from your authenticator app.
        </p>
        <form onSubmit={confirmDisable2FA} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Verification Code
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').substring(0, 6))}
              placeholder="Enter 6-digit code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              pattern="[0-9]{6}"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || token.length !== 6}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Disable Two-Factor Authentication'}
          </button>
          <button
            type="button"
            onClick={() => setStep('disabled')}
            className="w-full mt-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md flex items-start">
            <FiAlertCircle className="text-red-600 dark:text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
          </div>
        )}
      </div>
    );
  }
}