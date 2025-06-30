# CV Builder

Welcome to **CV Builder** - a modern, AI-powered platform for creating, analyzing, and optimizing professional CVs and resumes. Built with React, Node.js, and powered by advanced AI analysis capabilities.

A modern web application for creating, editing, downloading, and printing professional CVs with customizable templates.

## Key Features

- Create detailed CVs with personal info, skills, experiences, education, and references
- Preview your CV with a professional layout before downloading or printing
- Edit existing CVs with easy navigation between sections
- Download your CV as a PDF file
- Print your CV directly from the browser
- Responsive design for all devices

## Project Status

This version of the CV Builder includes fully functional:
- Complete form flow from personal information to references
- CV data storage and retrieval
- CV preview with professional formatting
- PDF generation and downloading
- CV editing capabilities
- Print functionality

## Quick Start

The easiest way to start the application is using our reliable startup script:

```bash
# Clone the repository
git clone git@github.com:Jimbo5289/cv-builder-2.git
cd cv-builder-2

# Install dependencies
npm install
cd server && npm install && cd ..

# Set up environment files
./setup-env.sh

# Start the application with the reliable script
node start-reliable.js
```

This will:
1. Kill any conflicting processes on relevant ports
2. Start the backend server on port 3005
3. Start the frontend on port 5173
4. Connect everything correctly

Then open http://localhost:5173 in your browser.

## Environment Setup

Before running the application, you need to set up your environment variables:

1. Run the setup script to create environment files:
   ```bash
   ./setup-env.sh
   ```

2. Edit the following files with your actual credentials:
   - `.env` - Frontend environment variables
   - `server/.env` - Backend environment variables

## Manual Setup

### Prerequisites

- Node.js 16+ (recommended: latest LTS)
- npm 8+

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Environment Setup

The project includes pre-configured environment files:

- `server/development.env` - Backend configuration
- Environment variables are automatically set by the startup scripts

### Starting Manually

If you need to start services individually:

```bash
# Start the backend
cd server
PORT=3005 MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true node src/index.js

# In a separate terminal, start the frontend
cd cv-builder-2
npm run dev -- --port 5173
```

## API Documentation

The project includes OpenAPI documentation for the backend API:

1. Start the documentation server:
   ```bash
   cd server
   npm run docs
   ```

2. Open http://localhost:3006/api-docs in your browser to view the API documentation.

## Troubleshooting

### Port Conflicts

If you encounter port conflicts:
- Use `node start-reliable.js` which automatically handles port conflicts
- Manually kill processes: `lsof -ti:3005,5173 | xargs kill -9` (Unix/Mac)

### Safari Compatibility

Safari users may experience connectivity issues. To solve:
1. Always use the reliable startup script
2. Make sure backend runs on port 3005
3. Make sure frontend runs on port 5173

### Server Connection Issues

If the frontend can't connect to the backend:
1. Check if the backend is running (`curl http://localhost:3005/health`)
2. Ensure you've started both services
3. Try restarting with `node start-reliable.js`

## Development

### Project Structure

```
cv-builder/
├── src/                # Frontend React code
│   ├── components/     # Reusable React components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   └── routes.jsx      # Application routes
│
├── server/             # Backend Node.js/Express code
│   ├── src/            # Server source code
│   │   ├── config/     # Configuration files
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Express middlewares
│   │   └── index.js    # Server entry point
│   ├── openapi.yaml    # API documentation
│   └── development.env # Development environment variables
│
├── package.json        # Frontend dependencies and scripts
├── server/package.json # Backend dependencies and scripts
└── start-reliable.js   # Reliable startup script
```

### Technology Stack

- **Frontend**:
  - React with Vite
  - React Router for navigation
  - Context API for state management
  - Tailwind CSS for styling
  - PDF.js and html2canvas for PDF generation

- **Backend**:
  - Node.js with Express
  - PostgreSQL with Prisma ORM
  - JWT for authentication
  - Stripe for payment processing

## License

MIT

## Contact

For support or contributions, please contact:
- GitHub: [https://github.com/Jimbo5289/cv-builder-2](https://github.com/Jimbo5289/cv-builder-2)

---

*Last updated: June 2025 - Dependencies verified and GitHub Actions working*
# Force deploy Fri Jun 20 22:24:07 BST 2025
