import request from 'supertest';
import app from '../../../src/app';
import { createTestUser, createTestAdmin, createTestGenre } from '../setup';

describe('Genre Routes - Integration Tests', () => {
  describe('GET /api/genres', () => {
    it('should return all genres when authenticated', async () => {
      const user = await createTestUser();
      await createTestGenre({ name: 'Ação' });
      await createTestGenre({ name: 'Romance' });

      const response = await request(app)
        .get('/api/genres')
        .set('Authorization', `Bearer ${user.token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
    });

    it('should return empty array when no genres exist', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/genres')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/genres')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/genres')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/genres/:id', () => {
    it('should return a genre by id', async () => {
      const user = await createTestUser();
      const genre = await createTestGenre({
        name: 'Ação',
        description: 'Animes de ação',
        isAdultContent: false,
      });

      const response = await request(app)
        .get(`/api/genres/${genre.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.id).toBe(genre.id);
      // Name is normalized to lowercase by Name value object
      expect(response.body.name).toBe(genre.name.toLowerCase());
      expect(response.body.description).toBe(genre.description);
      expect(response.body.isAdultContent).toBe(genre.isAdultContent);
    });

    it('should return a genre with adult content flag', async () => {
      const user = await createTestUser();
      const genre = await createTestGenre({
        name: 'Ecchi',
        description: 'Conteúdo adulto',
        isAdultContent: true,
      });

      const response = await request(app)
        .get(`/api/genres/${genre.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.isAdultContent).toBe(true);
    });

    it('should return 404 when genre does not exist', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/genres/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 with invalid id format', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/genres/invalid-id')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const genre = await createTestGenre();

      const response = await request(app)
        .get(`/api/genres/${genre.id}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/genres', () => {
    it('should create a genre when admin', async () => {
      const admin = await createTestAdmin();

      const genreData = {
        name: 'Novo Gênero',
        description: 'Descrição do novo gênero',
        isAdultContent: false,
      };

      const response = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${admin.token}`)
        .send(genreData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      // Name is normalized to lowercase by Name value object
      expect(response.body.name).toBe(genreData.name.toLowerCase());
      expect(response.body.description).toBe(genreData.description);
      expect(response.body.isAdultContent).toBe(genreData.isAdultContent);
    });

    it('should create an adult content genre', async () => {
      const admin = await createTestAdmin();

      const genreData = {
        name: 'Ecchi',
        description: 'Conteúdo adulto leve',
        isAdultContent: true,
      };

      const response = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${admin.token}`)
        .send(genreData)
        .expect(201);

      expect(response.body.isAdultContent).toBe(true);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          name: 'Novo Gênero',
          description: 'Descrição',
          isAdultContent: false,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 409 when genre name already exists', async () => {
      const admin = await createTestAdmin();
      await createTestGenre({ name: 'Ação' });

      const response = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Ação',
          description: 'Outra descrição',
          isAdultContent: false,
        })
        .expect(409);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with missing name', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          description: 'Descrição sem nome',
          isAdultContent: false,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with missing description', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Nome sem descrição',
          isAdultContent: false,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should create genre with default isAdultContent as false', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Novo Gênero',
          description: 'Descrição válida',
        })
        .expect(201);

      expect(response.body.isAdultContent).toBe(false);
    });

    it('should return 400 with short name', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/genres')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'AB',
          description: 'Descrição válida',
          isAdultContent: false,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/genres')
        .send({
          name: 'Novo Gênero',
          description: 'Descrição',
          isAdultContent: false,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/genres/:id', () => {
    it('should delete a genre when admin', async () => {
      const admin = await createTestAdmin();
      const genre = await createTestGenre();

      await request(app)
        .delete(`/api/genres/${genre.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/genres/${genre.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const genre = await createTestGenre();

      const response = await request(app)
        .delete(`/api/genres/${genre.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when genre does not exist', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .delete('/api/genres/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 with invalid id format', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .delete('/api/genres/invalid-id')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const genre = await createTestGenre();

      const response = await request(app)
        .delete(`/api/genres/${genre.id}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});
