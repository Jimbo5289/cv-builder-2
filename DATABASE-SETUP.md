# CV Builder Database Setup Guide

## Prerequisites

Before setting up the database, ensure you have the following installed:

1. **Docker Desktop** - Download from [Docker's official website](https://www.docker.com/products/docker-desktop)
2. **Node.js** and **npm** - Latest LTS version recommended

## Setup Process

### Automated Setup (Recommended)

1. Run the provided setup script:
   ```
   ./setup-database.sh
   ```

   This script will:
   - Check if Docker is installed and running
   - Create the necessary environment file
   - Start PostgreSQL and pgAdmin using Docker Compose
   - Initialize the database schema with Prisma
   - Seed the database with initial data

2. After successful setup, you can access:
   - PostgreSQL database on port 5432
   - pgAdmin web interface at http://localhost:5050
     - Email: admin@example.com
     - Password: admin

### Manual Setup

If you prefer to set up the database manually:

1. Ensure Docker Desktop is running.

2. Create a `.env` file in the `server` directory with the following content:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cv_builder
   NODE_ENV=development
   PORT=3005
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRY=1d
   JWT_REFRESH_SECRET=your_refresh_secret_key_here
   JWT_REFRESH_EXPIRY=7d
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   SKIP_AUTH_CHECK=true
   MOCK_SUBSCRIPTION_DATA=true
   FRONTEND_URL=http://localhost:5173
   ```

3. Start the Docker containers:
   ```
   docker-compose up -d
   ```

4. Navigate to the server directory and run:
   ```
   cd server
   npx prisma generate
   npx prisma migrate dev --name initial-migration
   node src/scripts/db-init.js
   ```

## Database Information

### Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: cv_builder
- **Username**: postgres
- **Password**: postgres

### Schema

The database includes the following tables:

- **User**: User accounts with authentication data
- **UserProfile**: Extended user information
- **CV**: CV documents created by users
- **CVSection**: Sections within each CV
- **CVTemplate**: Available templates for CVs
- **JobApplication**: Job applications associated with CVs
- **Payment**: Payment records
- **Subscription**: User subscription data

## Database Management

- **View Database Schema**: `npx prisma studio`
- **Reset Database**: `npx prisma migrate reset`
- **Update Schema**: `npx prisma migrate dev --name description-of-changes`

## Troubleshooting

### Docker Issues

- If Docker fails to start, ensure Docker Desktop is running
- If ports are already in use, stop any existing PostgreSQL instances

### Database Connection Issues

- Verify the DATABASE_URL in your .env file
- Check if the Docker containers are running with `docker ps`
- Restart containers with `docker-compose restart`

### Migration Issues

- If migrations fail, reset the database with `npx prisma migrate reset`
- Check error logs for specific issues 