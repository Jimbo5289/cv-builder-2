const express = require('express');
const request = require('supertest');
const database = require('../../../config/database');
const cvRoutes = require('../cv');

describe('CV Routes', () => {
  let app;
  let server;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/cv', cvRoutes);
    server = app.listen(3000);
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
    server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /cv/:id', () => {
    it('should return 404 for non-existent CV', async () => {
      const response = await request(app)
        .get('/cv/non-existent-id')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'CV not found' });
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get('/cv/test-id');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('POST /cv', () => {
    it('should create a new CV', async () => {
      const cvData = {
        title: 'Test CV',
        content: 'Test content',
        isPublic: false
      };

      const response = await request(app)
        .post('/cv')
        .set('Authorization', 'Bearer test-token')
        .send(cvData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(cvData.title);
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/cv')
        .set('Authorization', 'Bearer test-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /cv/:id', () => {
    it('should update an existing CV', async () => {
      const updateData = {
        title: 'Updated CV',
        content: 'Updated content',
        isPublic: true
      };

      const response = await request(app)
        .put('/cv/test-id')
        .set('Authorization', 'Bearer test-token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
    });

    it('should return 404 for non-existent CV', async () => {
      const response = await request(app)
        .put('/cv/non-existent-id')
        .set('Authorization', 'Bearer test-token')
        .send({ title: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'CV not found' });
    });
  });

  describe('DELETE /cv/:id', () => {
    it('should delete an existing CV', async () => {
      const response = await request(app)
        .delete('/cv/test-id')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent CV', async () => {
      const response = await request(app)
        .delete('/cv/non-existent-id')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'CV not found' });
    });
  });
}); 