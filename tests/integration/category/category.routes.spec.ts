import request from 'supertest';
import app from '../../../src/app';
import { createTestUser, createTestAdmin, createTestCategory } from '../setup';

describe('Category Routes - Integration Tests', () => {
  describe('GET /api/categories', () => {
    it('should return all categories when authenticated', async () => {
      const user = await createTestUser();
      await createTestCategory({ name: 'Ação' });
      await createTestCategory({ name: 'Comédia' });

      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${user.token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
    });

    it('should return empty array when no categories exist', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/categories').expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by id', async () => {
      const user = await createTestUser();
      const category = await createTestCategory({ name: 'Ação', description: 'Animes de ação' });

      const response = await request(app)
        .get(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.id).toBe(category.id);
      // Name is normalized to lowercase by Name value object
      expect(response.body.name).toBe(category.name.toLowerCase());
      expect(response.body.description).toBe(category.description);
    });

    it('should return 404 when category does not exist', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/categories/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 with invalid id format', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/categories/invalid-id')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const category = await createTestCategory();

      const response = await request(app).get(`/api/categories/${category.id}`).expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/categories', () => {
    it('should create a category when admin', async () => {
      const admin = await createTestAdmin();

      const categoryData = {
        name: 'Nova Categoria',
        description: 'Descrição da nova categoria',
      };

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${admin.token}`)
        .send(categoryData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      // Name is normalized to lowercase by Name value object
      expect(response.body.name).toBe(categoryData.name.toLowerCase());
      expect(response.body.description).toBe(categoryData.description);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          name: 'Nova Categoria',
          description: 'Descrição',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 409 when category name already exists', async () => {
      const admin = await createTestAdmin();
      await createTestCategory({ name: 'Ação' });

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Ação',
          description: 'Outra descrição',
        })
        .expect(409);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with missing name', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          description: 'Descrição sem nome',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with missing description', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Nome sem descrição',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with short name', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'AB',
          description: 'Descrição válida',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Nova Categoria',
          description: 'Descrição',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();

      await request(app)
        .delete(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();

      const response = await request(app)
        .delete(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when category does not exist', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .delete('/api/categories/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 with invalid id format', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .delete('/api/categories/invalid-id')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const category = await createTestCategory();

      const response = await request(app).delete(`/api/categories/${category.id}`).expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});
