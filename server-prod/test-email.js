require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a test account
async function main() {
  console.log('Testing email configuration...');
  
  console.log('Email settings:');
  console.log('Host:', process.env.EMAIL_HOST);
  console.log('Port:', process.env.EMAIL_PORT);
  console.log('Secure:', process.env.EMAIL_SECURE);
  console.log('User:', process.env.EMAIL_USER);
  console.log('From:', process.env.EMAIL_FROM);
  
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    debug: true // Show debug output
  });
  
  try {
    // Verify connection
    console.log('Verifying connection...');
    const verifyResult = await transporter.verify();
    console.log('Connection verified:', verifyResult);
    
    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'CV Builder <support@cvbuilder.com>',
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email',
      text: 'This is a test email to verify SMTP configuration',
      html: '<b>This is a test email to verify SMTP configuration</b>'
    });
    
    console.log('Message sent:', info.messageId);
  } catch (error) {
    console.error('Error:', error);
    
    // Additional troubleshooting info
    if (error.code === 'EAUTH') {
      console.log('\nAuthentication Error!');
      console.log('For Gmail accounts, you might need to:');
      console.log('1. Use an App Password (not your regular password)');
      console.log('2. Enable 2-Step Verification first to use App Passwords');
      console.log('3. Make sure your Google Workspace admin hasn\'t restricted access');
    }
  }
}

main().catch(console.error); 