import request from 'supertest';
import app from '../../../src/app';
import {
  createTestUser,
  createTestAdmin,
  createTestCategory,
  createTestGenre,
  createTestAnime,
} from '../setup';
import UserModel from '../../../src/infrastructure/database/models/user.model';

describe('User Routes - Integration Tests', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'ValidPassword123!',
        imageUrl: 'https://example.com/avatar.jpg',
        biography: 'A new user biography',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(userData.username);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.biography).toBe(userData.biography);
      expect(response.body.role).toBe('user');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should create an admin user when role is specified', async () => {
      const userData = {
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'ValidPassword123!',
        imageUrl: 'https://example.com/avatar.jpg',
        biography: 'Admin biography',
        role: 'admin',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.role).toBe('admin');
    });

    it('should return 409 when email already exists', async () => {
      await createTestUser({ email: 'existing@example.com' });

      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'anotheruser',
          email: 'existing@example.com',
          password: 'ValidPassword123!',
          imageUrl: 'https://example.com/avatar.jpg',
          biography: 'Biography',
        })
        .expect(409);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'newuser',
          email: 'invalid-email',
          password: 'ValidPassword123!',
          imageUrl: 'https://example.com/avatar.jpg',
          biography: 'Biography',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with weak password', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: '123',
          imageUrl: 'https://example.com/avatar.jpg',
          biography: 'Biography',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with missing username', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'newuser@example.com',
          password: 'ValidPassword123!',
          imageUrl: 'https://example.com/avatar.jpg',
          biography: 'Biography',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with short username', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'ab',
          email: 'newuser@example.com',
          password: 'ValidPassword123!',
          imageUrl: 'https://example.com/avatar.jpg',
          biography: 'Biography',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with invalid imageUrl', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'ValidPassword123!',
          imageUrl: 'invalid-url',
          biography: 'Biography',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users when admin', async () => {
      const admin = await createTestAdmin();
      await createTestUser({ email: 'user1@example.com' });
      await createTestUser({ email: 'user2@example.com' });

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(3); // admin + 2 users
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.id).toBe(user.id);
      // Email is normalized to lowercase by Email value object
      expect(response.body.email).toBe(user.email.toLowerCase());
      // Username is normalized to lowercase by Name value object
      expect(response.body.username).toBe(user.username.toLowerCase());
    });

    it('should return 404 when user does not exist', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 with invalid id format', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/users/invalid-id')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user data', async () => {
      const user = await createTestUser();

      const updateData = {
        username: 'updateduser',
        biography: 'Updated biography',
      };

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.username).toBe(updateData.username);
      expect(response.body.biography).toBe(updateData.biography);
    });

    it('should update user email', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          email: 'newemail@example.com',
        })
        .expect(200);

      expect(response.body.email).toBe('newemail@example.com');
    });

    it('should update user password', async () => {
      const user = await createTestUser({
        email: 'test@example.com',
        password: 'OldPassword123!',
      });

      await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          password: 'NewPassword123!',
        })
        .expect(200);

      // Verify new password works
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewPassword123!',
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('accessToken');
    });

    it('should return 404 when user does not exist', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .put('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          username: 'updateduser',
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 409 when email already exists', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      await createTestUser({ email: 'user2@example.com' });

      const response = await request(app)
        .put(`/api/users/${user1.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          email: 'user2@example.com',
        })
        .expect(409);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .send({
          username: 'updateduser',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user when admin', async () => {
      const admin = await createTestAdmin();
      const user = await createTestUser();

      await request(app)
        .delete(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);
    });

    it('should return 401 when user is not admin', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();

      const response = await request(app)
        .delete(`/api/users/${user2.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when user does not exist', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .delete('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/:id/anime-list', () => {
    it('should add anime to user list', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .post(`/api/users/${user.id}/anime-list`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          animeId: anime.id,
        })
        .expect(200);

      expect(response.body.animeList.list).toHaveLength(1);
      expect(response.body.animeList.list[0].animeId).toBe(anime.id);
    });

    it('should return 404 when anime does not exist', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post(`/api/users/${user.id}/anime-list`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          animeId: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when user does not exist', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const anime = await createTestAnime(category.id);

      const response = await request(app)
        .post('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV/anime-list')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          animeId: anime.id,
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV/anime-list')
        .send({
          animeId: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/users/:id/anime-list/:animeId', () => {
    it('should remove anime from user list', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      // Add anime first
      await request(app)
        .post(`/api/users/${user.id}/anime-list`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          animeId: anime.id,
        })
        .expect(200);

      // Remove anime
      const response = await request(app)
        .delete(`/api/users/${user.id}/anime-list/${anime.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.animeList.list).toHaveLength(0);
    });

    it('should return 400 when anime is not in user list', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id], {
        movies: [{ title: 'Test Movie', releaseDate: new Date() }],
        seasons: [{ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 12 }],
      });

      const response = await request(app)
        .delete(`/api/users/${user.id}/anime-list/${anime.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV/anime-list/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PATCH /api/users/:id/anime-list/:animeId/like', () => {
    it('should toggle anime like', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      // Add anime first
      await request(app)
        .post(`/api/users/${user.id}/anime-list`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          animeId: anime.id,
        })
        .expect(200);

      // Toggle like
      const response = await request(app)
        .patch(`/api/users/${user.id}/anime-list/${anime.id}/like`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.animeList.list[0].isLiked).toBe(true);

      // Toggle like again
      const response2 = await request(app)
        .patch(`/api/users/${user.id}/anime-list/${anime.id}/like`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response2.body.animeList.list[0].isLiked).toBe(false);
    });

    it('should return 400 when anime is not in user list', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id], {
        movies: [{ title: 'Test Movie', releaseDate: new Date() }],
        seasons: [{ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 12 }],
      });

      const response = await request(app)
        .patch(`/api/users/${user.id}/anime-list/${anime.id}/like`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .patch('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV/anime-list/01ARZ3NDEKTSV4RRFFQ69G5FAV/like')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PATCH /api/users/:id/anime-list/:animeId/movie-status', () => {
    it('should update movie status', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id], {
        animeType: 'movie',
        movies: [
          {
            title: 'Movie 1',
            releaseDate: new Date(),
          },
        ],
      });

      // Add anime first
      await request(app)
        .post(`/api/users/${user.id}/anime-list`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          animeId: anime.id,
        })
        .expect(200);

      // Update movie status
      const response = await request(app)
        .patch(`/api/users/${user.id}/anime-list/${anime.id}/movie-status`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          movie: {
            name: 'Movie 1',
            releaseDate: new Date(),
          },
          status: 'finished',
          isLiked: true,
        })
        .expect(200);

      expect(response.body).toHaveProperty('animeList');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .patch('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV/anime-list/01ARZ3NDEKTSV4RRFFQ69G5FAV/movie-status')
        .send({
          movie: {
            name: 'Movie 1',
            releaseDate: new Date(),
          },
          status: 'finished',
          isLiked: true,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PATCH /api/users/:id/anime-list/:animeId/season-status', () => {
    it('should update season status', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id], {
        animeType: 'serie',
        seasons: [
          {
            seasonNumber: 1,
            releaseDate: new Date(),
            totalEpisodes: 12,
          },
        ],
      });

      // Add anime first
      await request(app)
        .post(`/api/users/${user.id}/anime-list`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          animeId: anime.id,
        })
        .expect(200);

      // Update season status
      const response = await request(app)
        .patch(`/api/users/${user.id}/anime-list/${anime.id}/season-status`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          season: {
            seasonNumber: 1,
            releaseDate: new Date(),
            totalEpisodes: 12,
          },
          status: 'watching',
          lastEpisodeWatched: 5,
          isLiked: false,
        })
        .expect(200);

      expect(response.body).toHaveProperty('animeList');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .patch('/api/users/01ARZ3NDEKTSV4RRFFQ69G5FAV/anime-list/01ARZ3NDEKTSV4RRFFQ69G5FAV/season-status')
        .send({
          season: {
            seasonNumber: 1,
            releaseDate: new Date(),
            totalEpisodes: 12,
          },
          status: 'watching',
          lastEpisodeWatched: 5,
          isLiked: false,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});
