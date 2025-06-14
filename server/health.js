const http = require('http');

const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';

// Create a basic HTTP server that only responds to health checks
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', port: PORT }));
});

// Enable dual-stack (IPv4 and IPv6)
server.listen(PORT, HOST, () => {
  console.log(`Health check server running on ${HOST}:${PORT}`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});

// Keep the process running
setInterval(() => {
  console.log(`Health check server still running on port ${PORT}`);
}, 5000); 