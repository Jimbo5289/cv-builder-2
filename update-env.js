import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the server .env path
const serverEnvPath = path.join(__dirname, 'server', '.env');

// Create comprehensive server environment variables
const serverEnv = `NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET=use-a-more-secure-secret-in-production
JWT_EXPIRES_IN=86400
ALLOW_SAFARI_CONNECTIONS=true
DEBUG_CORS=true

# Database configuration (default PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cvbuilder?schema=public"

# OpenAI API key for AI features
OPENAI_API_KEY=your_openai_api_key
`;

// Update the server .env file
try {
  fs.writeFileSync(serverEnvPath, serverEnv);
  console.log('✅ Server environment file updated successfully');
} catch (err) {
  console.error('❌ Failed to update server environment file:', err.message);
}

// Create frontend environment file
const frontendEnvPath = path.join(__dirname, '.env.local');
const frontendEnv = `VITE_API_URL=http://localhost:3005
VITE_SKIP_AUTH=true
VITE_DEV_MODE=true`;

try {
  fs.writeFileSync(frontendEnvPath, frontendEnv);
  console.log('✅ Frontend environment file updated successfully');
} catch (err) {
  console.error('❌ Failed to update frontend environment file:', err.message);
}

console.log('📝 Environment setup complete!'); 