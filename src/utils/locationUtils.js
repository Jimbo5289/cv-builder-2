import { countries } from './countryCodes';

export const getDefaultCountry = async () => {
  try {
    // Try to get location from IP geolocation API
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Find the country code in our supported countries
    const countryCode = Object.keys(countries).find(
      code => code === data.country
    );
    
    // If found, return it, otherwise fall back to 'GB'
    return countryCode || 'GB';
  } catch (error) {
    console.warn('Could not detect location:', error);
    return 'GB'; // Default fallback
  }
};

export const isValidPhoneNumber = (number, country) => {
  const countryData = countries[country];
  if (!countryData) return false;

  // Remove all non-digit characters
  const digitsOnly = number.replace(/\D/g, '');
  
  // Get expected length based on format
  const expectedLength = countryData.format.split('').filter(char => char === '#').length;
  
  return digitsOnly.length === expectedLength;
}; 