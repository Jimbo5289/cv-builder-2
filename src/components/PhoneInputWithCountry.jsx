/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { countries } from '../utils/countryCodes';
import { getDefaultCountry } from '../utils/locationUtils';
import { BsFillTelephoneFill } from 'react-icons/bs';

const PhoneInputWithCountry = ({ value, onChange, label, required = false }) => {
  const [countryCode, setCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Initialize with location detection - only run once
  useEffect(() => {
    const initializeCountry = async () => {
      const defaultCountry = await getDefaultCountry();
      setCountryCode(`+${countries[defaultCountry]?.code || '44'}`);
    };
    
    if (!value) { // Only auto-detect if no value is provided
      initializeCountry();
    }
  }, []); // Empty dependency array means run once

  // Parse initial value when provided from parent
  useEffect(() => {
    if (value) {
      // Extract country code and phone number from the value
      const match = value.match(/^(\+\d+)\s(.*)$/);
      if (match) {
        setCountryCode(match[1]);
        setPhoneNumber(match[2]);
      }
    }
  }, [value]); // Only run when value changes

  // When internal state changes, notify parent
  // This is causing infinite loops - add conditions to prevent unnecessary updates
  useEffect(() => {
    // Only update the parent if we have something to update with
    if (countryCode && (phoneNumber || phoneNumber === '')) {
      // Skip update if the formatted value is the same as the current value
      const combinedValue = `${countryCode} ${phoneNumber}`;
      if (combinedValue !== value) {
        onChange(combinedValue);
      }
    }
  }, [countryCode, phoneNumber, onChange, value]); // Include value in dependencies

  const handlePhoneChange = (e) => {
    // Just accept the input as is - we're not going to do complex validation
    const input = e.target.value;
    setPhoneNumber(input);
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const getCountryFlag = (code) => {
    // Simple mapping of country code to emoji flag
    const countryKey = Object.keys(countries).find(
      key => `+${countries[key].code}` === code
    );
    
    return countryKey ? countries[countryKey].flag : '🌐';
  };

  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        className={`flex items-center border rounded-lg ${
          isFocused ? 'ring-2 ring-[#2c3e50] border-transparent' : 'border-gray-300'
        }`}
        style={{ height: '42px' }}
      >
        {/* Country Code Dropdown */}
        <div className="relative flex items-center h-full">
          <select
            value={countryCode}
            onChange={handleCountryCodeChange}
            className="h-full pl-2 pr-6 bg-gray-50 border-r border-gray-200 focus:outline-none appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                {data.flag} +{data.code}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-1 flex items-center h-full">
            <span className="text-gray-500 dark:text-gray-300 text-xs">▾</span>
          </div>
        </div>
        
        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 h-full py-0 px-4 focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          placeholder="7500 123456"
          aria-label="Phone number"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Enter your phone number with the country code
      </p>
    </div>
  );
};

export default PhoneInputWithCountry; 