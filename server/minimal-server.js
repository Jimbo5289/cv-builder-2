const http = require('http');

// Log all environment variables to see what Render provides
console.log('=== ENVIRONMENT VARIABLES ===');
console.log('PORT:', process.env.PORT);
console.log('All env vars containing "port" (case insensitive):');
Object.keys(process.env).forEach(key => {
  if (key.toLowerCase().includes('port')) {
    console.log(`${key}: ${process.env[key]}`);
  }
});
console.log('==============================');

// Use exactly what Render provides, no fallback
const PORT = process.env.PORT;
const HOST = '0.0.0.0';

if (!PORT) {
  console.error('ERROR: No PORT environment variable provided by Render');
  process.exit(1);
}

console.log(`Starting minimal server on ${HOST}:${PORT}`);

// Create the simplest possible HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Hello from Render! Server running on port ${PORT}\n`);
});

server.listen(PORT, HOST, () => {
  console.log(`✅ Server successfully listening on ${HOST}:${PORT}`);
  console.log(`Server address:`, server.address());
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

// Keep alive
setInterval(() => {
  console.log(`Server still running on port ${PORT}`);
}, 10000); 