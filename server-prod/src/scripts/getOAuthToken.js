const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Load credentials from .env file
const clientId = process.env.EMAIL_CLIENT_ID;
const clientSecret = process.env.EMAIL_CLIENT_SECRET;
const redirectUri = 'http://localhost:3005/auth/google/callback';

if (!clientId || !clientSecret) {
  console.error('Missing required environment variables: EMAIL_CLIENT_ID or EMAIL_CLIENT_SECRET');
  process.exit(1);
}

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

// Set scope for Gmail access
const SCOPES = ['https://mail.google.com/'];

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'  // Force to get a new refresh token each time
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display auth URL and prompt for code
console.log('Authorize this app by visiting this URL:', authUrl);
rl.question('Enter the code from that page here: ', async (code) => {
  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    console.log('\nOAuth tokens obtained successfully!');
    console.log('\nRefresh Token (add this to your .env file):');
    console.log('EMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
    
    // Instructions for updating .env file
    console.log('\nAdd this token to your .env file to use Gmail OAuth2 authentication');
    
    rl.close();
  } catch (error) {
    console.error('Error getting tokens:', error);
    rl.close();
  }
}); 