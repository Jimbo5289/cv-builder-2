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
        // Clean the phone number to only contain digits
        setPhoneNumber(match[2].replace(/[^0-9]/g, ''));
      } else if (value && !phoneNumber) {
        // If there's a value but no match, just set the phone number part
        // Clean the phone number to only contain digits
        setPhoneNumber(value.replace(/[^0-9]/g, ''));
      }
    }
  }, [value]);

  // Get the country code without the plus sign
  const getCountryCodeWithoutPlus = () => {
    return countryCode.replace(/^\+/, '');
  };

  // Find the country object based on the current country code
  const findCountryByCode = () => {
    const codeWithoutPlus = getCountryCodeWithoutPlus();
    // Find the country key that matches this code
    const countryKey = Object.keys(countries).find(
      key => countries[key].code === codeWithoutPlus
    );
    return countryKey ? countries[countryKey] : countries.GB; // Default to GB if not found
  };

  // Get the expected number of digits for the current country
  const getExpectedDigits = () => {
    const country = findCountryByCode();
    return country.format.split('').filter(char => char === '#').length;
  };

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
    
    // Validate the phone number based on country format
    if (phoneNumber.trim() === '') {
      setIsValid(true); // Empty is valid unless required
    } else {
      const expectedDigits = getExpectedDigits();
      setIsValid(phoneNumber.length === expectedDigits);
    }
  }, [countryCode, phoneNumber, onChange]);

  const handlePhoneChange = (e) => {
    // Make sure we're only accepting digits
    const input = e.target.value;
    const cleanedValue = input.replace(/[^0-9]/g, '');
    
    // Limit to expected number of digits
    const expectedDigits = getExpectedDigits();
    const limitedValue = cleanedValue.slice(0, expectedDigits);
    
    setPhoneNumber(limitedValue);
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
    // Reset validation when country changes
    if (phoneNumber) {
      const expectedDigits = getExpectedDigits();
      setIsValid(phoneNumber.length === expectedDigits);
    }
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

  // Get placeholder based on current country
  const getPlaceholder = () => {
    const country = findCountryByCode();
    return country.placeholder.replace(/[^0-9]/g, '');
  };

  // Get expected format for display
  const getFormatDisplay = () => {
    const country = findCountryByCode();
    return country.placeholder;
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
              <option key={code} value={`+${data.code}`} className="text-sm">
                {getCountryFlag(`+${data.code}`)} +{data.code}
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
          placeholder={getPlaceholder()}
          inputMode="numeric"
          pattern="[0-9]*"
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
        <p className="text-red-500 text-sm mt-1">
          Please enter exactly {getExpectedDigits()} digits for {findCountryByCode().flag} +{getCountryCodeWithoutPlus()}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-1">Format: {getFormatDisplay()}</p>
    </div>
  );
};

export default PhoneInput; 