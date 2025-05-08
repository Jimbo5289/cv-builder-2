import React, { useState, useEffect } from 'react';
import { countries } from '../utils/countryCodes';
import { getDefaultCountry, isValidPhoneNumber } from '../utils/locationUtils';

const PhoneInput = ({ value, onChange, label, required = false, error: externalError }) => {
  const [selectedCountry, setSelectedCountry] = useState('GB');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedNumber, setFormattedNumber] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [isAutofilling, setIsAutofilling] = useState(false);

  // Initialize with location detection
  useEffect(() => {
    const initializeCountry = async () => {
      const defaultCountry = await getDefaultCountry();
      setSelectedCountry(defaultCountry);
    };
    
    if (!value) { // Only auto-detect if no value is provided
      initializeCountry();
    }
  }, []);

  useEffect(() => {
    if (value) {
      // Extract country code and phone number from the value
      const match = value.match(/^\+(\d+)(.*)/);
      if (match) {
        const countryCode = match[1];
        const number = match[2].trim();
        
        // Find country by code
        const country = Object.entries(countries).find(([_, data]) => data.code === countryCode);
        if (country) {
          setSelectedCountry(country[0]);
          setPhoneNumber(number);
          formatNumber(country[0], number);
        }
      }
    }
  }, [value]);

  const formatNumber = (country, number) => {
    const countryData = countries[country];
    if (!countryData) return;

    let formatted = '';
    let numberIndex = 0;
    
    for (let i = 0; i < countryData.format.length; i++) {
      if (countryData.format[i] === '#') {
        if (numberIndex < number.length) {
          formatted += number[numberIndex];
          numberIndex++;
        }
      } else {
        formatted += countryData.format[i];
      }
    }

    setFormattedNumber(formatted);
    const fullNumber = `+${countryData.code}${number}`;
    
    // Validate the number
    const valid = isValidPhoneNumber(number, country);
    setIsValid(valid);
    setError(valid ? '' : `Invalid phone number format for ${countryData.flag} ${country}`);
    
    onChange(fullNumber);
  };

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    formatNumber(newCountry, phoneNumber);
  };

  const handlePhoneChange = (e) => {
    const newNumber = e.target.value.replace(/\D/g, '');
    setPhoneNumber(newNumber);
    formatNumber(selectedCountry, newNumber);
  };

  const handleAutofill = async () => {
    try {
      setIsAutofilling(true);
      setError('');

      // Method 1: Try using the Contacts API (if available)
      if ('contacts' in navigator && 'select' in navigator.contacts) {
        try {
          const contacts = await navigator.contacts.select(['tel'], { multiple: false });
          if (contacts && contacts[0] && contacts[0].tel && contacts[0].tel[0]) {
            const phoneNumber = contacts[0].tel[0];
            processPhoneNumber(phoneNumber);
            return;
          }
        } catch (err) {
          console.log('Contacts API not available or permission denied');
        }
      }

      // Method 2: Try using browser autofill
      const tempInput = document.createElement('input');
      tempInput.type = 'tel';
      tempInput.style.position = 'absolute';
      tempInput.style.left = '-9999px';
      document.body.appendChild(tempInput);

      try {
        tempInput.focus();
        tempInput.blur();
        await new Promise(resolve => setTimeout(resolve, 100));

        if (tempInput.value) {
          processPhoneNumber(tempInput.value);
          return;
        }
      } finally {
        document.body.removeChild(tempInput);
      }

      // Method 3: Try using clipboard
      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText && /^\+?[\d\s-()]+$/.test(clipboardText)) {
          processPhoneNumber(clipboardText);
          return;
        }
      } catch (err) {
        console.log('Clipboard access not available or denied');
      }

      // If all methods fail
      setError('Could not autofill phone number. Please enter it manually.');
    } catch (err) {
      console.error('Autofill error:', err);
      setError('Failed to autofill phone number. Please enter it manually.');
    } finally {
      setIsAutofilling(false);
    }
  };

  const processPhoneNumber = (phoneNumber) => {
    // Extract country code and number
    const match = phoneNumber.match(/^\+?(\d+)(.*)/);
    if (match) {
      const countryCode = match[1];
      const number = match[2].trim();
      
      // Find country by code
      const country = Object.entries(countries).find(([_, data]) => data.code === countryCode);
      if (country) {
        setSelectedCountry(country[0]);
        setPhoneNumber(number);
        formatNumber(country[0], number);
      } else {
        setError('Could not determine country code from phone number');
      }
    } else {
      setError('Invalid phone number format');
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className={`block w-[90px] rounded-md shadow-sm text-sm
            ${!isValid ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
            'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
        >
          {Object.entries(countries).map(([code, data]) => (
            <option key={code} value={code} className="text-sm">
              {data.flag} +{data.code}
            </option>
          ))}
        </select>
        <div className="flex-1 relative">
          <input
            type="tel"
            value={formattedNumber}
            onChange={handlePhoneChange}
            placeholder={countries[selectedCountry].placeholder}
            className={`w-full rounded-md shadow-sm 
              ${!isValid ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
              'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
            aria-invalid={!isValid}
            aria-describedby={!isValid ? 'phone-error' : undefined}
            autoComplete="tel"
          />
          <button
            type="button"
            onClick={handleAutofill}
            disabled={isAutofilling}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Autofill from contacts, browser, or clipboard"
          >
            {isAutofilling ? 'Autofilling...' : 'Autofill'}
          </button>
        </div>
      </div>
      {(error || externalError) && (
        <p className="mt-1 text-sm text-red-600" id="phone-error">
          {error || externalError}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Format: {countries[selectedCountry].placeholder}
      </p>
    </div>
  );
};

export default PhoneInput; 