/* eslint-disable */
import React, { useState } from 'react';

const PhoneInputSimple = ({ value, onChange, label, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handlePhoneChange = (e) => {
    // Only accept digits
    const input = e.target.value;
    const digitsOnly = input.replace(/[^0-9]/g, '');
    
    // Format as +XX XXXXXXXXXX
    if (digitsOnly.length > 0) {
      const countryCode = '+44'; // Default to UK
      onChange(`${countryCode} ${digitsOnly}`);
    } else {
      onChange('');
    }
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        className={`flex items-center border rounded-lg ${
          isFocused ? 'ring-2 ring-[#2c3e50] border-transparent' : 'border-gray-300'
        }`}
        style={{ height: '42px' }}
      >
        {/* Country Code - Fixed to UK for simplicity */}
        <div className="flex items-center h-full px-3 bg-gray-50 border-r border-gray-200">
          <span>🇬🇧 +44</span>
        </div>
        
        {/* Phone Number Input */}
        <input
          type="tel"
          value={value ? value.replace(/^\+\d+\s+/, '') : ''}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 h-full py-0 px-4 focus:outline-none"
          placeholder="7500123456"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label="Phone number"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">Format: digits only (e.g., 7500123456)</p>
    </div>
  );
};

export default PhoneInputSimple; 