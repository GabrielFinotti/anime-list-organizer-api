import request from 'supertest';
import app from '../../../src/app';
import { createTestUser, createTestAdmin } from '../setup';

describe('Auth Routes - Integration Tests', () => {
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const user = await createTestUser({
        email: 'test@example.com',
        password: 'ValidPassword123!',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'ValidPassword123!',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user.id).toBe(user.id);
      // Username is normalized to lowercase by the Name value object
      expect(response.body.user.username).toBe(user.username.toLowerCase());
      expect(response.body.user.role).toBe(user.role);
    });

    it('should login successfully as admin', async () => {
      const admin = await createTestAdmin({
        email: 'admin@example.com',
        password: 'AdminPassword123!',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPassword123!',
        })
        .expect(200);

      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.id).toBe(admin.id);
    });

    it('should return 401 with invalid password', async () => {
      await createTestUser({
        email: 'test@example.com',
        password: 'CorrectPassword123!',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with non-existent email', async () => {
      // API returns 401 for security reasons (doesn't expose if email exists)
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with invalid email format', async () => {
      // API returns 401 for any login failure
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'SomePassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with missing email', async () => {
      // API returns 401 for any login failure
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'SomePassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with missing password', async () => {
      // API returns 401 for any login failure
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      const user = await createTestUser();

      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(204);
    });

    it('should return 401 without authorization header', async () => {
      const response = await request(app).post('/api/auth/logout').expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with invalid token format', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'InvalidFormat token123')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with malformed token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 when using blacklisted token', async () => {
      const user = await createTestUser();

      // First logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(204);

      // Try to logout again with same token
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should logout successfully as admin', async () => {
      const admin = await createTestAdmin();

      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(204);
    });
  });
});
