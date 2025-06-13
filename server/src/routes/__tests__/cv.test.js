const express = require('express');
const request = require('supertest');
const { initDatabase, closeDatabase } = require('../../config/database');
const cvRoutes = require('../cv');

describe('CV Routes', () => {
  let app;
  let server;
  let dbClient;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/cv', cvRoutes);
    server = app.listen(3001);
    dbClient = await initDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
    await new Promise(resolve => server.close(resolve));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cv/:id', () => {
    it.skip('should return 404 for non-existent CV', async () => {
      const response = await request(app)
        .get('/api/cv/non-existent-id')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'CV not found' });
    });

    it.skip('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/api/cv/test-id');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('POST /api/cv', () => {
    it.skip('should create a new CV', async () => {
      const cvData = {
        title: 'Test CV',
        content: 'Test content',
        isPublic: false
      };

      const response = await request(app)
        .post('/api/cv')
        .set('Authorization', 'Bearer test-token')
        .send(cvData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(cvData.title);
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/cv')
        .set('Authorization', 'Bearer test-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/cv/:id', () => {
    it.skip('should update an existing CV', async () => {
      const updateData = {
        title: 'Updated CV',
        content: 'Updated content',
        isPublic: true
      };

      const response = await request(app)
        .put('/api/cv/test-id')
        .set('Authorization', 'Bearer test-token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
    });

    it.skip('should return 404 for non-existent CV', async () => {
      const response = await request(app)
        .put('/api/cv/non-existent-id')
        .set('Authorization', 'Bearer test-token')
        .send({ title: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'CV not found' });
    });
  });

  describe('DELETE /api/cv/:id', () => {
    it.skip('should delete an existing CV', async () => {
      const response = await request(app)
        .delete('/api/cv/test-id')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(204);
    });

    it.skip('should return 404 for non-existent CV', async () => {
      const response = await request(app)
        .delete('/api/cv/non-existent-id')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'CV not found' });
    });
  });
}); 