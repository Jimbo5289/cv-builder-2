# CV Builder Security Documentation

## Overview
This document outlines the comprehensive security measures implemented in the CV Builder application to ensure complete user data isolation and prevent unauthorized access to user information.

## Authentication & Authorization

### JWT Token-Based Authentication
- **Implementation**: All protected endpoints require valid JWT tokens in the `Authorization: Bearer <token>` header
- **Token Validation**: Tokens are verified using the `JWT_SECRET` environment variable
- **User Identification**: Each token contains the user's unique ID, which is used for all database queries
- **Token Expiry**: Tokens have configurable expiration times (default: 15 minutes for access tokens, 7 days for refresh tokens)

### Authentication Middleware (`server/src/middleware/auth.js`)
```javascript
// Primary authentication middleware
const auth = async (req, res, next) => {
  // Validates JWT token and adds user object to req.user
  // Ensures user exists in database before proceeding
}

// Enhanced user access validation
const validateUserAccess = (req, res, next) => {
  // Validates that any user ID parameters match the authenticated user
  // Prevents access to other users' data via URL manipulation
}

// CV ownership validation
const validateCVOwnership = async (req, res, next) => {
  // Ensures users can only access CVs they own
  // Validates CV ownership before any CV operations
}
```

## User Data Isolation

### Database Query Isolation
All database queries that access user-specific data include the authenticated user's ID in the `where` clause:

```javascript
// Example: CV retrieval
const cv = await database.client.CV.findUnique({
  where: {
    id: req.params.id,
    userId: req.user.id  // CRITICAL: Always filter by authenticated user ID
  }
});

// Example: User CVs listing
const cvs = await database.client.CV.findMany({
  where: {
    userId: req.user.id  // CRITICAL: Only return current user's CVs
  }
});
```

### Protected Endpoints
All user-specific endpoints are protected with multiple layers of security:

1. **Authentication Required**: `authMiddleware` validates JWT token
2. **User Access Validation**: `validateUserAccess` prevents user ID manipulation
3. **Resource Ownership**: `validateCVOwnership` ensures CV ownership for CV-specific operations

### CV-Specific Security
- **CV Access**: Users can only access CVs they created (`userId` field validation)
- **CV Modification**: All CV update operations verify ownership before proceeding
- **CV Download**: PDF downloads require both authentication and ownership validation
- **CV Deletion**: Only CV owners can delete their CVs

## Security Vulnerabilities Addressed

### 1. Public Debug Endpoint Removal
**Issue**: A public debug endpoint (`/debug/public-check/:userId`) allowed access to any user's CV data without authentication.

**Fix**: Completely removed the public endpoint and replaced with authenticated debug endpoints.

```javascript
// REMOVED: Public access vulnerability
// router.get('/debug/public-check/:userId', async (req, res) => {
//   // This allowed access to any user's data without authentication
// });

// SECURE: Authenticated debug endpoint
router.get('/debug/database-check', authMiddleware, async (req, res) => {
  // Only shows current user's data
});
```

### 2. Enhanced Parameter Validation
**Protection**: All endpoints validate that user ID parameters match the authenticated user.

```javascript
// Validates URL parameters like /api/users/:userId
// Validates request body fields like { userId: "..." }
// Prevents access to other users' data via parameter manipulation
```

### 3. CV Ownership Validation
**Protection**: All CV operations verify ownership before proceeding.

```javascript
// Before any CV operation, verify ownership
const cv = await database.client.CV.findUnique({
  where: { id: cvId },
  select: { userId: true }
});

if (cv.userId !== req.user.id) {
  return res.status(403).json({ error: 'Access denied: CV belongs to another user' });
}
```

## Endpoint Security Matrix

| Endpoint | Authentication | User Validation | Resource Validation | Notes |
|----------|---------------|-----------------|-------------------|-------|
| `POST /api/auth/login` | ❌ | ❌ | ❌ | Public endpoint |
| `POST /api/auth/register` | ❌ | ❌ | ❌ | Public endpoint |
| `GET /api/users/profile` | ✅ | ✅ | ❌ | User-specific data |
| `PUT /api/users/profile` | ✅ | ✅ | ❌ | User-specific updates |
| `GET /api/cv/:id` | ✅ | ✅ | ✅ | CV ownership required |
| `PUT /api/cv/:id/*` | ✅ | ✅ | ✅ | CV ownership required |
| `GET /api/cv/user/all` | ✅ | ✅ | ❌ | Returns only user's CVs |
| `POST /api/cv/save` | ✅ | ✅ | ✅ | CV ownership for updates |
| `GET /api/cv/download/:cvId` | ✅ | ✅ | ✅ | CV ownership required |

## Development Mode Security

### Mock User System
In development mode, a consistent mock user is used to avoid database dependencies while maintaining security patterns:

```javascript
const createMockUser = () => ({
  id: devUserId || 'dev-user-12345',
  email: devUserEmail || 'dev@example.com',
  name: devUserName || 'Development User',
  // ... other mock properties
});
```

### Environment-Based Security
- **Development**: Uses mock authentication but maintains security patterns
- **Production**: Full JWT authentication with database validation
- **Environment Variables**: Sensitive configuration via environment variables only

## Security Best Practices Implemented

### 1. Principle of Least Privilege
- Users can only access their own data
- No administrative endpoints without proper role validation
- Database queries always filter by authenticated user ID

### 2. Defense in Depth
- Multiple layers of validation (authentication → user validation → resource validation)
- Input validation and sanitization
- Comprehensive error handling without information leakage

### 3. Secure by Default
- All endpoints require authentication unless explicitly public
- Database queries default to user-specific filtering
- Error messages don't reveal sensitive information

### 4. Audit Trail
- All security-related events are logged
- Failed authentication attempts are tracked
- Unauthorized access attempts are logged with user context

## Security Testing

### Manual Testing Checklist
- [ ] Attempt to access other users' CVs by changing URL parameters
- [ ] Try to modify other users' data via API calls
- [ ] Test authentication bypass attempts
- [ ] Verify token expiration handling
- [ ] Test CORS configuration

### Automated Security Measures
- JWT token validation on every protected request
- Database-level user ID filtering
- Ownership validation for all resource access
- Input validation and sanitization

## Security Monitoring

### Logging
All security events are logged with appropriate detail levels:
- Authentication failures
- Authorization violations
- Suspicious access patterns
- Database query errors

### Error Handling
- Generic error messages to prevent information leakage
- Detailed logging for debugging without exposing sensitive data
- Proper HTTP status codes for different security violations

## Conclusion

The CV Builder application implements comprehensive security measures to ensure complete user data isolation. Every endpoint that accesses user-specific data includes multiple layers of validation to prevent unauthorized access. The removal of the public debug endpoint and implementation of enhanced ownership validation ensures that users can never access or modify other users' data.

Key security principles:
1. **Authentication Required**: All user data access requires valid JWT tokens
2. **User ID Validation**: All operations validate the authenticated user's identity
3. **Resource Ownership**: CV operations verify ownership before proceeding
4. **Database Filtering**: All queries filter by authenticated user ID
5. **Comprehensive Logging**: All security events are logged for monitoring

This multi-layered approach ensures that even if one security measure fails, additional layers prevent unauthorized access to user data. 