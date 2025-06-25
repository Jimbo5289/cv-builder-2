const https = require('https');
const fs = require('fs');

// Test job description content
const jobDescriptionContent = `Head of Building Safety

We are seeking an experienced Head of Building Safety to join our team. 

Key Requirements:
- Member Grade Institute of Fire Engineers (IFE) qualification
- Extensive experience in building safety management
- Knowledge of Building Safety Act and Golden Thread requirements
- Fire risk assessment experience
- Building regulations compliance
- IOSH or NEBOSH certification preferred

Responsibilities:
- Lead building safety compliance across portfolio
- Manage fire safety risk assessments
- Ensure compliance with building safety regulations
- Coordinate with fire engineers and safety consultants
- Oversee building safety improvements and remediation works

This is a senior leadership role requiring proven expertise in building safety management.`;

// CV content for testing
const cvContent = `James Ingleton
Watch Manager - Kent Fire and Rescue Service

Professional Experience:
Watch Manager, Kent Fire and Rescue Service (2018-Present)
- Leading emergency response operations and incident command
- Managing fire safety inspections and risk assessments
- Coordinating with building control authorities
- Training firefighters in building safety procedures

Qualifications:
- IOSH Managing Safety
- NEBOSH Fire Safety Certificate
- Emergency response training
- Leadership and management certification

Skills:
- Fire risk assessment
- Building safety management
- Emergency response
- Team leadership
- Safety compliance
- Incident management`;

async function testBackendAnalysis() {
  console.log('🧪 TESTING BACKEND ANALYSIS API');
  console.log('================================');
  
  // Create form data boundary
  const boundary = '----formdata-boundary-' + Math.random().toString(36);
  
  // Create the form data manually
  let formData = '';
  
  // Add CV file
  formData += `--${boundary}\r\n`;
  formData += `Content-Disposition: form-data; name="cv"; filename="cv.txt"\r\n`;
  formData += `Content-Type: text/plain\r\n\r\n`;
  formData += cvContent + '\r\n';
  
  // Add job description file
  formData += `--${boundary}\r\n`;
  formData += `Content-Disposition: form-data; name="jobDescription"; filename="job.txt"\r\n`;
  formData += `Content-Type: text/plain\r\n\r\n`;
  formData += jobDescriptionContent + '\r\n';
  
  formData += `--${boundary}--\r\n`;
  
  const options = {
    hostname: 'cv-builder-backend-zjax.onrender.com',
    port: 443,
    path: '/api/cv/analyze',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(formData),
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWJ3OWt1ZWkwMDAwNDloOXJyZWF6ZGl3IiwiaWF0IjoxNzM1MTU3NzQ0LCJleHAiOjE3MzUxNjEzNDR9.placeholder' // Temp token
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Response Status:', res.statusCode);
          console.log('🔍 Detected Industry:', response.industry || 'Not found');
          console.log('🔍 Detected Role:', response.role || 'Not found');
          console.log('🔍 Overall Score:', response.score || 'Not found');
          console.log('🔍 Match Type:', response.matchType || 'Not found');
          
          if (response.industry === 'building_safety') {
            console.log('✅ SUCCESS: Backend correctly detected building_safety');
          } else {
            console.log('❌ FAILED: Backend detected:', response.industry);
            console.log('❌ This explains the wrong analysis results!');
          }
          
          resolve(response);
        } catch (error) {
          console.log('❌ Error parsing response:', error.message);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request error:', error.message);
      reject(error);
    });
    
    req.write(formData);
    req.end();
  });
}

// Run the test
testBackendAnalysis().catch(console.error); 