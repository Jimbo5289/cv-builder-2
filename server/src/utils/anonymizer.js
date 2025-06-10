/* eslint-disable */
const CryptoJS = require('crypto-js');

// Salt for hashing - should be stored in environment variables
const HASH_SALT = process.env.HASH_SALT || 'default-salt-change-in-production';

class Anonymizer {
  static hashData(data) {
    if (!data) return null;
    return CryptoJS.SHA256(data + HASH_SALT).toString();
  }

  static hashEmail(email) {
    if (!email) return null;
    const [localPart, domain] = email.split('@');
    const hashedLocal = this.hashData(localPart);
    return `${hashedLocal.substring(0, 8)}...@${domain}`;
  }

  static hashIp(ip) {
    if (!ip) return null;
    return this.hashData(ip).substring(0, 16);
  }

  static maskUserId(userId) {
    if (!userId) return null;
    const hashedId = this.hashData(userId.toString());
    return `user_${hashedId.substring(0, 8)}`;
  }

  static anonymizeRequestData(req) {
    return {
      ip: this.hashIp(req.ip),
      userId: req.user ? this.maskUserId(req.user.id) : null,
      email: req.user ? this.hashEmail(req.user.email) : null,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    };
  }

  static anonymizeError(error) {
    const errorObj = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };

    // Remove sensitive information from error messages and stack traces
    errorObj.message = errorObj.message.replace(
      /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g,
      (email) => this.hashEmail(email)
    );

    if (errorObj.stack) {
      errorObj.stack = errorObj.stack.replace(
        /(\/Users\/[^\/]+)/g,
        '/Users/[REDACTED]'
      );
    }

    return errorObj;
  }
}

module.exports = Anonymizer; 