import { Configuration, OpenAIApi } from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to extract text from PDF
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Function to extract text from DOCX
async function extractTextFromDOCX(filePath) {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file;
    if (!file) {
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
    console.error('Error processing CV:', error);
    return res.status(500).json({ error: 'Error processing CV' });
  }
} 