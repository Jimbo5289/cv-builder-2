/* eslint-disable */
// Convert to CommonJS to match the server's module system
const fs = require('fs');
const path = require('path');

// Try to load pdf-parse with fallback
let pdfParse = null;
try {
  pdfParse = require('pdf-parse');
  console.log('CV Parser: pdf-parse loaded successfully');
} catch (err) {
  console.log('CV Parser: pdf-parse not available, will use fallback text extraction');
}

/**
 * Parse CV from buffer or file path
 * @param {string|Buffer} input - File path or buffer
 * @returns {Promise<string>} - Extracted text
 */
async function parseCV(input) {
  try {
    let buffer;
    
    // Handle both file path and buffer inputs
    if (typeof input === 'string') {
      buffer = fs.readFileSync(input);
    } else if (Buffer.isBuffer(input)) {
      buffer = input;
    } else {
      throw new Error('Input must be a file path or buffer');
    }
    
    // Try PDF parsing if available
    if (pdfParse) {
      try {
        const data = await pdfParse(buffer);
        return data.text || '';
      } catch (pdfError) {
        console.warn('PDF parsing failed, using fallback:', pdfError.message);
      }
    }
    
    // Fallback: simple text extraction
    const text = buffer.toString('utf8');
    // Basic cleanup for common PDF artifacts
    return text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
      
  } catch (error) {
    console.error('CV parsing error:', error.message);
    return ''; // Return empty string on error
  }
}

module.exports = { parseCV }; 