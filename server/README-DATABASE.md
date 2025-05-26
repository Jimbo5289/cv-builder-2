# CV Builder Database Setup

This document explains how to set up and configure the database for the CV Builder application.

## Database Structure

The CV Builder uses PostgreSQL with Prisma ORM. The database schema includes:

- **Users**: Account information, authentication, and user profiles
- **CVs**: Resume/CV documents created by users
- **CV Sections**: Different sections within each CV
- **CV Templates**: Available templates for CVs
- **Subscriptions**: User subscription data for premium features
- **Payments**: Payment records

## Setup Options

### Option 1: Using Docker (Recommended)

1. Ensure Docker and Docker Compose are installed on your system
2. From the project root, run:
   ```
   docker-compose up -d
   ```
3. This will start PostgreSQL on port 5432 and pgAdmin on port 5050
4. Access pgAdmin at http://localhost:5050 with:
   - Email: admin@example.com
   - Password: admin

### Option 2: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a new database:
   ```
   createdb cv_builder
   ```
3. Update your environment variables to match your PostgreSQL configuration

## Environment Variables

Create a `.env` file in the server directory with the following settings:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cv_builder

# Server Configuration
NODE_ENV=development
PORT=3005

# JWT Auth
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=1d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRY=7d

# Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Development Settings
SKIP_AUTH_CHECK=false
MOCK_SUBSCRIPTION_DATA=true
```

## Initializing the Database

1. Apply the Prisma migrations to create the database schema:
   ```
   cd server
   npx prisma migrate dev
   ```

2. Generate the Prisma client:
   ```
   npx prisma generate
   ```

3. Seed the database with initial data:
   ```
   node src/scripts/db-init.js
   ```

## Database Management

- To view and edit the database schema: `npx prisma studio`
- To reset the database: `npx prisma migrate reset`
- To update the schema after changes: `npx prisma migrate dev --name description-of-changes`

## Database Schema Diagram

```
┌─────────────┐       ┌──────────────┐
│    User     │       │UserProfile   │
├─────────────┤       ├──────────────┤
│id           │       │id            │
│email        │       │userId        │──┐
│password     │       │location      │  │
│name         │◄──────│profession    │  │
│...          │       │...           │  │
└─────────────┘       └──────────────┘  │
       ▲                                │
       │                                │
       │ 1:N                            │
┌──────┴──────┐                         │
│     CV      │                         │
├─────────────┤                         │
│id           │                         │
│title        │                         │
│content      │                         │
│templateId   │                         │
│userId       │─────────────────────────┘
│isPublic     │
│...          │
└─────────────┘
       ▲
       │ 1:N
       │
┌──────┴──────┐
│ CVSection   │
├─────────────┤
│id           │
│title        │
│content      │
│order        │
│cvId         │
└─────────────┘
``` 