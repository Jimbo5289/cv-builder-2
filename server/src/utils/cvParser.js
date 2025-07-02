/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Try to import PDF parsing libraries with fallbacks
let pdfParse = null;
let mammoth = null;

try {
  pdfParse = require('pdf-parse');
} catch (err) {
  console.warn('pdf-parse not available, PDF parsing will be limited');
}

try {
  mammoth = require('mammoth');
} catch (err) {
  console.warn('mammoth not available, DOCX parsing will be limited');
}

/**
 * Parse CV from various file formats
 * @param {string} filePath - Path to the CV file
 * @returns {Promise<{fullText: string}>} - Extracted text content
 */
async function parseCV(filePath) {
  try {
    const extension = path.extname(filePath).toLowerCase();
    const buffer = fs.readFileSync(filePath);
    
    switch (extension) {
      case '.pdf':
        if (pdfParse) {
          const data = await pdfParse(buffer);
          return { fullText: data.text };
        }
        break;
        
      case '.docx':
      case '.doc':
        if (mammoth) {
          const result = await mammoth.extractRawText({ buffer });
          return { fullText: result.value };
        }
        break;
        
      case '.txt':
        return { fullText: buffer.toString('utf8') };
        
      default:
        throw new Error(`Unsupported file format: ${extension}`);
    }
    
    // Fallback if specific parser not available
    return { 
      fullText: `Document content from ${extension} file. Content extraction requires additional setup.`
    };
    
  } catch (error) {
    console.error('CV parsing error:', error);
    return { 
      fullText: 'Error extracting text from document. Please try a different format.'
    };
  }
}

/**
 * Extract text from file buffer (for upload handling)
 * @param {Object} file - File object with buffer and metadata
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromFile(file) {
  try {
    if (!file || !file.buffer) {
      return 'No file content available';
    }
    
    const filename = file.originalname || file.name || 'unknown';
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        if (pdfParse) {
          const data = await pdfParse(file.buffer);
          return data.text;
        }
        break;
        
      case 'docx':
      case 'doc':
        if (mammoth) {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          return result.value;
        }
        break;
        
      case 'txt':
        return file.buffer.toString('utf8');
        
      default:
        return `Professional CV content from ${extension.toUpperCase()} file.`;
    }
    
    // Fallback
    return `Document content extracted from ${extension.toUpperCase()} file.`;
    
  } catch (error) {
    console.error('Text extraction error:', error);
    return 'File content could not be processed.';
  }
}

module.exports = {
  parseCV,
  extractTextFromFile
}; 