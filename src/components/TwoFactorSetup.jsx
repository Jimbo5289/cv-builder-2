import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function TwoFactorSetup() {
  const [step, setStep] = useState('initial'); // initial, setup, verify, success
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const initiate2FASetup = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3002/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to setup 2FA');
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep('setup');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('http://localhost:3002/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify 2FA');
      }

      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('http://localhost:3002/api/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to disable 2FA');
      }

      setStep('initial');
      setToken('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'initial') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication</h2>
        <p className="text-gray-600 mb-6">
          Enhance your account security by enabling two-factor authentication. 
          This adds an extra layer of protection by requiring a code from your 
          authenticator app when signing in.
        </p>
        <button
          onClick={initiate2FASetup}
          disabled={isLoading}
          className="w-full bg-[#E78F81] text-white py-2 px-4 rounded-md hover:bg-[#d36e62] transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Setting up...' : 'Enable 2FA'}
        </button>
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
        <p className="text-gray-600 mb-6">
          1. Install an authenticator app like Google Authenticator or Authy
          <br />
          2. Scan this QR code with your authenticator app
          <br />
          3. Enter the 6-digit code shown in your app
        </p>
        <div className="mb-6 flex justify-center">
          <img src={qrCode} alt="2FA QR Code" className="border p-2 rounded-lg" />
        </div>
        <form onSubmit={verify2FA} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter 6-digit code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E78F81] text-white py-2 px-4 rounded-md hover:bg-[#d36e62] transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Can't scan the QR code? Manually enter this code in your authenticator app:
            <br />
            <code className="block mt-2 p-2 bg-gray-100 rounded">{secret}</code>
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            2FA Enabled Successfully
          </h2>
          <p className="mt-2 text-gray-600">
            Your account is now protected with two-factor authentication.
            Keep your backup codes in a safe place.
          </p>
          <button
            onClick={() => setStep('initial')}
            className="mt-6 bg-[#E78F81] text-white py-2 px-4 rounded-md hover:bg-[#d36e62] transition-colors duration-200"
          >
            Done
          </button>
        </div>
      </div>
    );
  }
} 