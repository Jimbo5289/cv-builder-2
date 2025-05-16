import React, { useState, useEffect } from 'react';
import { countries } from '../utils/countryCodes';
import { getDefaultCountry, isValidPhoneNumber } from '../utils/locationUtils';
import { BsFillTelephoneFill } from 'react-icons/bs';

const PhoneInput = ({ value, onChange, label, required = false, error: externalError }) => {
  const [countryCode, setCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  // Initialize with location detection
  useEffect(() => {
    const initializeCountry = async () => {
      const defaultCountry = await getDefaultCountry();
      setCountryCode(defaultCountry);
    };
    
    if (!value) { // Only auto-detect if no value is provided
      initializeCountry();
    }
  }, []);

  // Parse initial value when provided from parent
  useEffect(() => {
    if (value) {
      // Extract country code and phone number from the value
      const match = value.match(/^(\+\d+)\s(.*)$/);
      if (match) {
        setCountryCode(match[1]);
        setPhoneNumber(match[2]);
      } else if (value && !phoneNumber) {
        // If there's a value but no match, just set the phone number part
        setPhoneNumber(value);
      }
    }
  }, [value]);

  // When internal state changes, notify parent
  useEffect(() => {
    if (phoneNumber) {
      // Only combine if we have an actual phone number
      const combinedValue = `${countryCode} ${phoneNumber}`;
      onChange(combinedValue);
    } else {
      // If we don't have a phone number, just clear the value
      onChange('');
    }
    
    // Validate the phone number
    if (phoneNumber.trim() === '') {
      setIsValid(true); // Empty is valid unless required
    } else {
      setIsValid(/^[0-9\s()-]{7,}$/.test(phoneNumber));
    }
  }, [countryCode, phoneNumber, onChange]);

  const handlePhoneChange = (e) => {
    // Make sure we're only accepting digits, spaces, hyphens and parentheses
    const input = e.target.value;
    const cleanedValue = input.replace(/[^0-9\s()-]/g, '');
    setPhoneNumber(cleanedValue);
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const getCountryFlag = (code) => {
    // Simple mapping of country code to emoji flag
    const codeToFlag = {
      '+1': '🇺🇸',
      '+44': '🇬🇧',
      '+33': '🇫🇷',
      '+49': '🇩🇪',
      '+61': '🇦🇺',
      '+91': '🇮🇳',
    };
    return codeToFlag[code] || '🌐';
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        className={`flex items-center border rounded-lg ${
          !isValid ? 'border-red-500' : isFocused ? 'ring-2 ring-[#2c3e50] border-transparent' : 'border-gray-300'
        }`}
        style={{ height: '42px' }}
      >
        {/* Country Code Dropdown */}
        <div className="relative flex items-center h-full">
          <select
            value={countryCode}
            onChange={handleCountryCodeChange}
            className="h-full pl-2 pr-6 bg-gray-50 border-r border-gray-200 focus:outline-none appearance-none"
            style={{ 
              minWidth: '90px',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              textIndent: '1px',
              textOverflow: ''
            }}
          >
            {Object.entries(countries).map(([code, data]) => (
              <option key={code} value={code} className="text-sm">
                {getCountryFlag(code)} +{data.code}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-1 flex items-center h-full">
            <span className="text-gray-500 text-xs">▾</span>
          </div>
        </div>
        
        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 h-full py-0 px-4 focus:outline-none"
          placeholder="7500 123456"
          inputMode="tel"
          pattern="[0-9\s()-]*"
          aria-label="Phone number"
        />
        
        {/* Validation indicator */}
        {!isValid && phoneNumber && (
          <div className="bg-red-100 text-red-600 h-full flex items-center px-2">
            <BsFillTelephoneFill />
          </div>
        )}
      </div>
      
      {/* Error message */}
      {!isValid && phoneNumber && (
        <p className="text-red-500 text-sm mt-1">Please enter a valid phone number</p>
      )}
      <p className="text-xs text-gray-500 mt-1">Format: 7500 123456</p>
    </div>
  );
};

export default PhoneInput; 