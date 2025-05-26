/**
 * Utility functions for date formatting in CV templates
 */

/**
 * Formats a date string into a more readable format
 * @param {string} dateStr - Date string from the form (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "May 2022")
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return original if invalid date
    
    // Format as "Month Year"
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr; // Return original on error
  }
};

/**
 * Creates a date range string
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} Formatted date range (e.g., "May 2020 - Present" or "May 2020 - June 2022")
 */
export const formatDateRange = (startDate, endDate) => {
  const formattedStart = formatDate(startDate);
  const formattedEnd = endDate ? formatDate(endDate) : 'Present';
  
  if (!formattedStart && !formattedEnd) return '';
  if (formattedStart && !formattedEnd) return formattedStart;
  if (!formattedStart && formattedEnd) return formattedEnd;
  
  return `${formattedStart} - ${formattedEnd}`;
}; 