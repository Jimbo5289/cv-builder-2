const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const { logger } = require('./logger');

// Get the absolute path to the .env file
const envPath = path.resolve(__dirname, '../../.env');
logger.info('Looking for .env file at:', envPath);

// First check if the file exists
if (!fs.existsSync(envPath)) {
    logger.error(`ENV file not found at: ${envPath}`);
    logger.warn('Continuing with environment defaults and mock services');
} else {
    // Load the .env file
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
        logger.error('Error loading .env file:', result.error.message);
        logger.warn('Continuing with environment defaults and mock services');
    } else {
        logger.info('Environment file loaded successfully');
    }
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
        SENTRY_ENVIRONMENT: 'development',
        JWT_SECRET: 'development-secret-key-replace-in-production',
        FRONTEND_URL: 'http://localhost:5173'
    }
};

function validateEnv() {
    const missingVars = [];
    const warnings = [];

    // Check required variables and set defaults if needed
    for (const [varName, description] of Object.entries(envConfig.required)) {
        if (!process.env[varName]) {
            if (envConfig.defaults[varName]) {
                process.env[varName] = envConfig.defaults[varName];
                warnings.push(`Using default value for ${varName}: ${envConfig.defaults[varName]}`);
            } else {
                missingVars.push({ name: varName, description });
            }
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

    // Handle validation results - log warnings but don't exit
    if (missingVars.length > 0) {
        const errorMessage = missingVars
            .map(({ name, description }) => `${name}: ${description}`)
            .join('\n');
        logger.error('Missing required environment variables:\n' + errorMessage);
        logger.error('Please check your .env file at:', envPath);
        // Don't exit, continue with mock services
        process.env.MOCK_DATABASE = 'true';
        process.env.MOCK_SUBSCRIPTION_DATA = 'true';
        process.env.SKIP_AUTH_CHECK = 'true';
        logger.warn('Continuing with mock services enabled due to missing environment variables');
    }

    if (warnings.length > 0) {
        warnings.forEach(warning => logger.warn(warning));
    }

    logger.info('Environment validation completed');
}

// Export validated environment variables
module.exports = {
    validateEnv,
    JWT_SECRET: process.env.JWT_SECRET || envConfig.defaults.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT || envConfig.defaults.PORT,
    NODE_ENV: process.env.NODE_ENV || envConfig.defaults.NODE_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || envConfig.defaults.SENTRY_ENVIRONMENT,
    SENTRY_RELEASE: process.env.SENTRY_RELEASE,
    FRONTEND_URL: process.env.FRONTEND_URL || envConfig.defaults.FRONTEND_URL
}; 