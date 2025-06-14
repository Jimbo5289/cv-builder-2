/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { countries } from '../utils/countryCodes';
import { getDefaultCountry } from '../utils/locationUtils';
import { BsFillTelephoneFill } from 'react-icons/bs';

const PhoneInputWithCountry = ({ value, onChange, label, required = false }) => {
  console.log('PhoneInputWithCountry received value:', value, 'type:', typeof value);
  
  const [countryCode, setCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isInternalChange, setIsInternalChange] = useState(false);
  const initialRenderRef = useRef(true);
  const previousValueRef = useRef(value);
  const processingRef = useRef(false);

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
    // Skip during the first render or when the change is internal
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    // Skip processing if this change was triggered internally
    if (isInternalChange) {
      setIsInternalChange(false);
      return;
    }

    // Skip if we're already processing to prevent loops
    if (processingRef.current) {
      return;
    }

    // Only process if value has changed from previous
    if (value !== previousValueRef.current) {
      processingRef.current = true;
      previousValueRef.current = value;

      if (value) {
        // First try to match: +XX XXXXXXXXX (country code + space + number)
        const spaceMatch = value.match(/^(\+\d{1,4})\s(.+)$/);
        if (spaceMatch) {
          console.log('PhoneInputWithCountry: Matched space pattern:', spaceMatch);
          setCountryCode(spaceMatch[1]);
          setPhoneNumber(spaceMatch[2]);
        } else {
          // Try to match: +XXXXXXXXXXX (country code directly followed by number)
          const directMatch = value.match(/^(\+\d{1,4})(.+)$/);
          if (directMatch) {
            setCountryCode(directMatch[1]);
            setPhoneNumber(directMatch[2]);
          } else if (value.startsWith('+')) {
            // Just a country code with no number
            setCountryCode(value);
            setPhoneNumber('');
          } else if (value.startsWith('0') && value.length >= 10) {
            // Handle UK domestic format (07850680317) - convert to international
            setCountryCode('+44');
            // Remove the leading 0 for international format
            setPhoneNumber(value.substring(1));
          } else {
            // No country code detected, treat as phone number only
            setPhoneNumber(value);
          }
        }
      } else {
        // Handle empty value case
        setPhoneNumber('');
      }
      
      // Reset processing flag after a short delay to allow state updates to complete
      setTimeout(() => {
        processingRef.current = false;
      }, 0);
    }
  }, [value, isInternalChange]); // Run when value changes or internal change flag changes

  // When internal state changes, notify parent
  useEffect(() => {
    // Skip during the first render
    if (initialRenderRef.current) {
      return;
    }

    // Skip if we're processing an external update
    if (processingRef.current) {
      return;
    }

    // Only update the parent if we have something to update with and it's different
    if (countryCode) {
      // Format the combined value
      const trimmedPhoneNumber = phoneNumber.trim();
      const combinedValue = trimmedPhoneNumber ? `${countryCode} ${trimmedPhoneNumber}` : '';
      
      // Make sure we're not in a loop by checking if the value is actually different
      // We normalize the strings by removing extra spaces for comparison
      const normalizedValue = value ? value.replace(/\s+/g, ' ').trim() : '';
      const normalizedCombined = combinedValue.replace(/\s+/g, ' ').trim();
      
      if (normalizedCombined !== normalizedValue && normalizedCombined !== '') {
        setIsInternalChange(true);
        previousValueRef.current = combinedValue;
        onChange(combinedValue);
      }
    }
  }, [countryCode, phoneNumber, onChange, value]); // Include value in dependencies

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    // Remove non-numeric characters for consistency (except spaces)
    const cleanedInput = input.replace(/[^\d\s]/g, '');
    setPhoneNumber(cleanedInput);
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