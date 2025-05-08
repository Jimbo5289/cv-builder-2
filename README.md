# CV Builder

A modern web application for creating professional CVs and resumes.

## Features

- Create and customize professional CVs
- Multiple templates to choose from
- Export to PDF format
- Contact form with email functionality
- Responsive design for all devices

## Technology Stack

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: PostgreSQL with Prisma ORM
- Email: Nodemailer with Gmail SMTP
- Styling: CSS with modern design patterns

## Setup

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- Gmail account for email functionality

### Installation

1. Clone the repository:
```
git clone [your-repository-url]
cd cv-builder
```

2. Install dependencies:
```
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Configure environment variables:
   - Create `.env` file in the server directory
   - Set up database, email, and other configuration variables

4. Start development servers:
```
# Start backend server
cd server
npm start

# Start frontend development server
cd ..
npm run dev
```

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

## License

[MIT](LICENSE)

## Contact

Your Name - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/yourusername/cv-builder](https://github.com/yourusername/cv-builder)
