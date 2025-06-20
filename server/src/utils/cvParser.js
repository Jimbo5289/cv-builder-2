/* eslint-disable */
import fs from 'fs';
import pdfParse from 'pdf-parse';

export async function parseCV(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
} 