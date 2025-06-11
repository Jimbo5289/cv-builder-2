// Import necessary libraries for handling file uploads and AI integration
import { Configuration, OpenAIApi } from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false, // Required for handling file uploads
  },
};

// OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // API key for OpenAI
});
const openai = new OpenAIApi(configuration);

// Function to extract text from PDF files
// Arguments:
//   filePath - Path to the PDF file
// Returns:
//   Extracted text from the PDF
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath); // Read file as buffer
  const data = await pdf(dataBuffer); // Parse PDF data
  return data.text; // Return extracted text
}

// Function to extract text from DOCX files
// Arguments:
//   filePath - Path to the DOCX file
// Returns:
//   Extracted text from the DOCX
async function extractTextFromDOCX(filePath) {
  const buffer = fs.readFileSync(filePath); // Read file as buffer
  const result = await mammoth.extractRawText({ buffer }); // Extract text using Mammoth
  return result.value; // Return extracted text
}

// API handler for analyzing CVs
// Handles file uploads and integrates with OpenAI for analysis
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Reject non-POST requests
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable(); // Initialize formidable for file parsing
    
    // Parse form data to extract fields and files
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file; // Extract uploaded file
    if (!file) {
      // Return error if no file is uploaded
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text based on file type
    let cvText;
    if (file.mimetype === 'application/pdf') {
      cvText = await extractTextFromPDF(file.filepath);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cvText = await extractTextFromDOCX(file.filepath);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Analyze CV using OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS (Applicant Tracking System) analyzer. Analyze the given CV and provide detailed feedback on its ATS compatibility, including a score out of 100, specific recommendations for improvement, and missing important keywords."
        },
        {
          role: "user",
          content: cvText
        }
      ],
    });

    const analysis = completion.data.choices[0].message.content;

    // Clean up the temporary file
    fs.unlinkSync(file.filepath);

    // Parse the AI response and structure it
    const analysisResult = {
      score: parseInt(analysis.match(/(\d+)(?=\s*\/\s*100)/)[0]),
      recommendations: analysis.match(/Recommendations:([\s\S]*?)(?=Missing Keywords:|$)/i)[1].trim().split('\n'),
      missingKeywords: analysis.match(/Missing Keywords:([\s\S]*?)(?=$)/i)[1].trim().split('\n'),
    };

    return res.status(200).json(analysisResult);
  } catch (error) {
    // Handle errors during file parsing or analysis
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}