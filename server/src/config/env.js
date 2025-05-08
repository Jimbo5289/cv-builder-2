const path = require('path');
const dotenv = require('dotenv');
const { logger } = require('./logger');

// Get the absolute path to the .env file
const envPath = path.resolve(__dirname, '../../.env');
logger.info('Looking for .env file at:', envPath);

// Load the .env file
const result = dotenv.config({ path: envPath });

if (result.error) {
    logger.error('Error loading .env file:', result.error.message);
    process.exit(1);
}

// Define environment variable requirements
const envConfig = {
    required: {
        JWT_SECRET: 'Secret key for JWT token generation',
        DATABASE_URL: 'Database connection URL',
        PORT: 'Server port number'
    },
    optional: {
        SENTRY_DSN: 'Sentry DSN for error tracking',
        SENTRY_ENVIRONMENT: 'Environment name for Sentry',
        SENTRY_RELEASE: 'Release version for Sentry',
        FRONTEND_URL: 'Frontend application URL',
        NODE_ENV: 'Node environment (development/production)'
    },
    defaults: {
        PORT: '3005',
        NODE_ENV: 'development',
        SENTRY_ENVIRONMENT: 'development'
    }
};

function validateEnv() {
    const missingVars = [];
    const warnings = [];

    // Check required variables
    for (const [varName, description] of Object.entries(envConfig.required)) {
        if (!process.env[varName]) {
            missingVars.push({ name: varName, description });
        }
    }

    // Check optional variables and set defaults
    for (const [varName, description] of Object.entries(envConfig.optional)) {
        if (!process.env[varName] && envConfig.defaults[varName]) {
            process.env[varName] = envConfig.defaults[varName];
            warnings.push(`Using default value for ${varName}: ${envConfig.defaults[varName]}`);
        }
    }

    // Log warnings for missing optional variables
    for (const [varName, description] of Object.entries(envConfig.optional)) {
        if (!process.env[varName] && !envConfig.defaults[varName]) {
            warnings.push(`Missing optional environment variable: ${varName} (${description})`);
        }
    }

    // Handle validation results
    if (missingVars.length > 0) {
        const errorMessage = missingVars
            .map(({ name, description }) => `${name}: ${description}`)
            .join('\n');
        logger.error('Missing required environment variables:\n' + errorMessage);
        logger.error('Please check your .env file at:', envPath);
        process.exit(1);
    }

    if (warnings.length > 0) {
        warnings.forEach(warning => logger.warn(warning));
    }

    logger.info('Environment validation completed successfully');
}

// Export validated environment variables
module.exports = {
    validateEnv,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT || envConfig.defaults.PORT,
    NODE_ENV: process.env.NODE_ENV || envConfig.defaults.NODE_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || envConfig.defaults.SENTRY_ENVIRONMENT,
    SENTRY_RELEASE: process.env.SENTRY_RELEASE,
    FRONTEND_URL: process.env.FRONTEND_URL
}; 