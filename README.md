# CV Builder

A modern web application for creating, analyzing, and managing CVs.

## How to Start the Application

### Using the Fixed Port Solution (Recommended)

We've developed a special startup script that solves the port conflicts and Safari compatibility issues:

```bash
# Run the fixed port startup script
node fixed-port-startup.js
```

This script:
- Kills any existing processes on required ports
- Sets up proper environment configuration
- Ensures backend runs on port 3005
- Ensures frontend runs on port 5173
- Properly connects frontend to backend
- Fixes Safari compatibility issues

### Manual Startup (Legacy)

If you prefer to start the services manually:

```bash
# Start the backend server first
cd server
npm run dev

# In a separate terminal, start the frontend
cd ..
npm run dev
```

## Development

### Prerequisites

- Node.js 16+
- npm 8+

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Environment Setup

Create a `.env` file in the server directory:

```
NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=86400
```

### Troubleshooting Safari Connection Issues

If you're experiencing Safari-specific connection issues:

1. Use the `fixed-port-startup.js` script (recommended)
2. Ensure DISABLE_PORT_FALLBACK=true in your server's .env
3. Make sure the frontend uses the correct API URL (http://localhost:3005)

## Features

- CV creation with modern templates
- CV analysis powered by AI
- Subscription management
- Safari compatibility
- Responsive design

## License

MIT

## Technology Stack

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: PostgreSQL with Prisma ORM
- Email: Nodemailer with Gmail SMTP
- Styling: CSS with modern design patterns

## Project Structure

```
cv-builder/
├── public/            # Static assets
├── src/               # Frontend React code
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # Reusable React components
│   ├── pages/         # Page components
│   └── ...
├── server/            # Backend Node.js/Express code
│   ├── src/           # Server source code
│   │   ├── config/    # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/ # Express middlewares
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic
│   │   └── ...
│   └── ...
└── ...
```

## Contact

Your Name - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/yourusername/cv-builder](https://github.com/yourusername/cv-builder)
