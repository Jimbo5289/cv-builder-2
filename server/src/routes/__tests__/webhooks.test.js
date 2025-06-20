const express = require('express');
const request = require('supertest');
const stripe = require('stripe');
const { initDatabase, closeDatabase } = require('../../config/database');
const webhookRoutes = require('../webhooks');

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'test_session_id',
            customer: 'test_customer_id',
            subscription_end: Math.floor(Date.now() / 1000) + 86400 // 1 day from now
          }
        }
      })
    },
    customers: {
      retrieve: jest.fn().mockResolvedValue({
        id: 'test_customer_id',
        email: 'test@example.com'
      })
    }
  }));
});

describe('Webhook Routes', () => {
  let app;
  let server;
  let dbClient;

  beforeAll(async () => {
    app = express();
    app.use('/api/webhooks', webhookRoutes);
    server = app.listen(3002);
    dbClient = await initDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
    await new Promise(resolve => server.close(resolve));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/webhooks/stripe', () => {
    it('should process a valid webhook event', async () => {
      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('Stripe-Signature', 'valid_signature')
        .send({});

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
    });

    it('should return 400 for missing signature', async () => {
      const response = await request(app)
        .post('/api/webhooks/stripe')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'No signature found' });
    });

    it('should return 400 for invalid signature', async () => {
      stripe.mockImplementation(() => ({
        webhooks: {
          constructEvent: jest.fn().mockImplementation(() => {
            throw new Error('Invalid signature');
          })
        }
      }));

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('Stripe-Signature', 'invalid_signature')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid signature' });
    });
  });
}); 