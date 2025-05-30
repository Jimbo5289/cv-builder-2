# Stripe Webhook Handler Documentation

## 🔔 Supported Events

Our webhook handler processes the following Stripe events:

- `checkout.session.completed`: Triggered when a customer successfully completes a checkout session
- `customer.subscription.deleted`: Triggered when a subscription is cancelled or expires
- `customer.subscription.updated`: Triggered when a subscription is updated (e.g., plan change)
- `customer.subscription.created`: Triggered when a new subscription is created

## 📥 Expected Payload Structure

### checkout.session.completed
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_123",
      "customer": "cus_123",
      "subscription_end": 1234567890
    }
  }
}
```

### customer.subscription.deleted
```json
{
  "type": "customer.subscription.deleted",
  "data": {
    "object": {
      "id": "sub_123",
      "customer": "cus_123"
    }
  }
}
```

### customer.subscription.updated
```json
{
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      "id": "sub_123",
      "customer": "cus_123",
      "status": "active",
      "current_period_end": 1234567890
    }
  }
}
```

### customer.subscription.created
```json
{
  "type": "customer.subscription.created",
  "data": {
    "object": {
      "id": "sub_123",
      "customer": "cus_123",
      "status": "active",
      "current_period_end": 1234567890
    }
  }
}
```

## 🔒 Security

### Signature Verification
The webhook endpoint requires a valid Stripe signature in the `stripe-signature` header. The signature is verified using your Stripe webhook secret through Stripe's `constructEvent()` method.

Key security points:
- All webhook requests must include the `stripe-signature` header
- Signature verification is performed before any event processing
- The raw request body is preserved for accurate signature verification
- Webhook secret is stored securely in environment variables

## 📤 Response Format

### Success Response (200 OK)
```json
{
  "received": true
}
```

### Error Responses

#### Missing Signature (400 Bad Request)
```json
{
  "error": "No signature found"
}
```

#### Invalid Signature (400 Bad Request)
```json
{
  "error": "Invalid signature"
}
```

#### Unhandled Event Type (204 No Content)
No response body - indicates the event was received but not processed

#### Internal Server Error (500 Internal Server Error)
```json
{
  "error": "Internal server error"
}
```

## 🚨 Error Handling

### Logging Strategy
All errors are logged with comprehensive context:
- Error message
- Event type
- Timestamp
- Relevant IDs (customer, subscription, session)
- Stack trace (for internal errors)

### Retry Behavior
- 4xx errors (400, 404, etc.) indicate client errors that won't be retried by Stripe
- 5xx errors (500, 503, etc.) indicate server errors that will trigger Stripe retries
- All errors are logged for monitoring and debugging

### Error Categories
1. **Signature Errors**
   - Missing signature
   - Invalid signature
   - Malformed signature

2. **Event Processing Errors**
   - Unknown event type
   - Invalid event payload
   - Missing required fields

3. **Database Errors**
   - User not found
   - Update failures
   - Connection issues

4. **External Service Errors**
   - Stripe API failures
   - Network issues
   - Timeout errors

## 📝 Implementation Notes

1. The webhook handler uses `express.raw()` middleware to ensure the raw body is available for signature verification
2. All database operations are wrapped in try-catch blocks
3. User existence is verified before processing subscription events
4. Subscription status and end dates are updated based on the event type

## 🔍 Testing

The webhook handler includes comprehensive test coverage using Jest. Tests cover:
- Signature verification
- Event type validation
- Error handling
- Database operations
- Response formatting

To run tests:
```bash
npm test
```

For watch mode:
```bash
npm run test:watch
``` 