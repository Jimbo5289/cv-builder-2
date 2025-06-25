// Jest setup file - runs before all tests
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock_secret';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.PORT = '3005';
process.env.FRONTEND_URL = 'http://localhost:5173';

// Suppress console warnings for tests unless it's an actual error
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args) => {
  const message = args.join(' ');
  // Only show warnings that are actually important for tests
  if (
    !message.includes('Prisma not available') &&
    !message.includes('DATABASE_URL not found') &&
    !message.includes('CV Parser not available') &&
    !message.includes('Auth middleware not available') &&
    !message.includes('Logger not available') &&
    !message.includes('AI Analysis service not available')
  ) {
    originalConsoleWarn.apply(console, args);
  }
};

console.error = (...args) => {
  const message = args.join(' ');
  // Suppress known non-critical errors in test environment
  if (
    !message.includes('Failed to initialize Stripe') &&
    !message.includes('Missing required Stripe environment variables')
  ) {
    originalConsoleError.apply(console, args);
  }
}; 