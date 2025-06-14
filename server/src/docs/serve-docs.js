/**
 * API Documentation Server
 * 
 * This script sets up a simple Express server to serve the OpenAPI documentation
 * using Swagger UI. It loads the OpenAPI specification from the YAML file and
 * makes it available at http://localhost:3006/api-docs.
 */

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');

// Load OpenAPI specification
const openApiPath = path.join(__dirname, '../../openapi.yaml');
const swaggerDocument = YAML.load(openApiPath);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CV Builder API Documentation',
}));

// Redirect root to docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('===================================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log('===================================================');
}); 