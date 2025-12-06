import request from 'supertest';
import app from '../../../src/app';
import {
  createTestUser,
  createTestAdmin,
  createTestCategory,
  createTestGenre,
  createTestAnime,
} from '../setup';

describe('Anime Routes - Integration Tests', () => {
  describe('GET /api/animes', () => {
    it('should return all animes when authenticated', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      await createTestAnime(category.id, [genre.id], { name: 'Anime 1' });
      await createTestAnime(category.id, [genre.id], { name: 'Anime 2' });

      const response = await request(app)
        .get('/api/animes')
        .set('Authorization', `Bearer ${user.token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
    });

    it('should return empty array when no animes exist', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/animes')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/animes').expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/animes/:id', () => {
    it('should return an anime by id', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .get(`/api/animes/${anime.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.id).toBe(anime.id);
      // Name is normalized to lowercase by Name value object
      expect(response.body.name).toBe(anime.name.toLowerCase());
      expect(response.body.synopsis).toBe(anime.synopsis);
    });

    it('should return 404 when anime does not exist', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 with invalid id format', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/animes/invalid-id')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV').expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/animes', () => {
    it('should create an anime when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();

      const animeData = {
        name: 'Novo Anime',
        imageUrl: 'https://example.com/anime.jpg',
        synopsis: 'Uma sinopse muito longa e detalhada do anime que está sendo criado para testes',
        categoryId: category.id,
        genreIds: [genre.id],
        animeType: 'serie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [],
        seasons: [
          {
            seasonNumber: 1,
            releaseDate: new Date().toISOString(),
            totalEpisodes: 12,
          },
        ],
        isAdultContent: false,
      };

      const response = await request(app)
        .post('/api/animes')
        .set('Authorization', `Bearer ${admin.token}`)
        .send(animeData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(animeData.name.toLowerCase());
      expect(response.body.synopsis).toBe(animeData.synopsis);
      expect(response.body.animeType).toBe(animeData.animeType);
    });

    it('should create an anime with movies', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();

      const animeData = {
        name: 'Anime Movie',
        imageUrl: 'https://example.com/anime.jpg',
        synopsis: 'Uma sinopse muito longa e detalhada do anime que está sendo criado para testes',
        categoryId: category.id,
        genreIds: [genre.id],
        animeType: 'movie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [
          {
            name: 'Movie 1',
            releaseDate: new Date().toISOString(),
          },
        ],
        seasons: [],
        isAdultContent: false,
      };

      const response = await request(app)
        .post('/api/animes')
        .set('Authorization', `Bearer ${admin.token}`)
        .send(animeData)
        .expect(201);

      expect(response.body.movies).toHaveLength(1);
    });

    it('should create an anime with seasons', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();

      const animeData = {
        name: 'Anime Serie',
        imageUrl: 'https://example.com/anime.jpg',
        synopsis: 'Uma sinopse muito longa e detalhada do anime que está sendo criado para testes',
        categoryId: category.id,
        genreIds: [genre.id],
        animeType: 'serie',
        productionType: 'original',
        typeOfMaterialOrigin: 'none',
        movies: [],
        seasons: [
          {
            seasonNumber: 1,
            releaseDate: new Date().toISOString(),
            totalEpisodes: 12,
          },
        ],
        isAdultContent: false,
      };

      const response = await request(app)
        .post('/api/animes')
        .set('Authorization', `Bearer ${admin.token}`)
        .send(animeData)
        .expect(201);

      expect(response.body.seasons).toHaveLength(1);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();

      const response = await request(app)
        .post('/api/animes')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          name: 'Novo Anime',
          imageUrl: 'https://example.com/anime.jpg',
          synopsis:
            'Uma sinopse muito longa e detalhada do anime que está sendo criado para testes',
          categoryId: category.id,
          genreIds: [genre.id],
          animeType: 'serie',
          productionType: 'original',
          typeOfMaterialOrigin: 'none',
          seasons: [
            {
              seasonNumber: 1,
              releaseDate: new Date().toISOString(),
              totalEpisodes: 12,
            },
          ],
          isAdultContent: false,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when category does not exist', async () => {
      const admin = await createTestAdmin();
      const genre = await createTestGenre();

      const response = await request(app)
        .post('/api/animes')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Novo Anime',
          imageUrl: 'https://example.com/anime.jpg',
          synopsis: 'Uma sinopse muito longa e detalhada do anime que está sendo criado',
          categoryId: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
          genreIds: [genre.id],
          animeType: 'serie',
          productionType: 'original',
          typeOfMaterialOrigin: 'none',
          seasons: [
            {
              seasonNumber: 1,
              releaseDate: new Date().toISOString(),
              totalEpisodes: 12,
            },
          ],
          isAdultContent: false,
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 409 when anime name already exists', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      await createTestAnime(category.id, [genre.id], { name: 'Existing Anime' });

      const response = await request(app)
        .post('/api/animes')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Existing Anime',
          imageUrl: 'https://example.com/anime.jpg',
          synopsis: 'Uma sinopse muito longa e detalhada do anime que está sendo criado',
          categoryId: category.id,
          genreIds: [genre.id],
          animeType: 'serie',
          productionType: 'original',
          typeOfMaterialOrigin: 'none',
          seasons: [
            {
              seasonNumber: 1,
              releaseDate: new Date().toISOString(),
              totalEpisodes: 12,
            },
          ],
          isAdultContent: false,
        })
        .expect(409);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with missing name', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();

      const response = await request(app)
        .post('/api/animes')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          imageUrl: 'https://example.com/anime.jpg',
          synopsis:
            'Uma sinopse muito longa e detalhada do anime que está sendo criado para testes',
          categoryId: category.id,
          genreIds: [genre.id],
          animeType: 'serie',
          productionType: 'original',
          typeOfMaterialOrigin: 'none',
          seasons: [
            {
              seasonNumber: 1,
              releaseDate: new Date().toISOString(),
              totalEpisodes: 12,
            },
          ],
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with short synopsis', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();

      const response = await request(app)
        .post('/api/animes')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Novo Anime',
          imageUrl: 'https://example.com/anime.jpg',
          synopsis: 'Curta',
          categoryId: category.id,
          genreIds: [genre.id],
          animeType: 'serie',
          productionType: 'original',
          typeOfMaterialOrigin: 'none',
          seasons: [
            {
              seasonNumber: 1,
              releaseDate: new Date().toISOString(),
              totalEpisodes: 12,
            },
          ],
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/animes')
        .send({
          name: 'Novo Anime',
          imageUrl: 'https://example.com/anime.jpg',
          synopsis: 'Uma sinopse longa',
          categoryId: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
          animeType: 'serie',
          productionType: 'original',
          typeOfMaterialOrigin: 'none',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/animes/:id', () => {
    it('should update an anime when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .put(`/api/animes/${anime.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Updated Anime Name',
        })
        .expect(200);

      expect(response.body.name).toBe('updated anime name');
    });

    it('should update anime synopsis', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const newSynopsis = 'Nova sinopse atualizada que é longa o suficiente para ser válida';

      const response = await request(app)
        .put(`/api/animes/${anime.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          synopsis: newSynopsis,
        })
        .expect(200);

      expect(response.body.synopsis).toBe(newSynopsis);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .put(`/api/animes/${anime.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          name: 'Updated Name',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when anime does not exist', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .put('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Updated Name',
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .send({
          name: 'Updated Name',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/animes/:id', () => {
    it('should delete an anime when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      await request(app)
        .delete(`/api/animes/${anime.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/animes/${anime.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .delete(`/api/animes/${anime.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when anime does not exist', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .delete('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/animes/:id/movies', () => {
    it('should add a movie to anime when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id], {
        animeType: 'movie',
        movies: [{ title: 'First Movie', releaseDate: new Date() }],
      });

      const response = await request(app)
        .post(`/api/animes/${anime.id}/movies`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'New Movie',
          releaseDate: new Date().toISOString(),
        })
        .expect(200);

      expect(response.body.movies).toHaveLength(2);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .post(`/api/animes/${anime.id}/movies`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          name: 'New Movie',
          releaseDate: new Date().toISOString(),
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when anime does not exist', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV/movies')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'New Movie',
          releaseDate: new Date().toISOString(),
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV/movies')
        .send({
          name: 'New Movie',
          releaseDate: new Date().toISOString(),
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/animes/:id/movies', () => {
    it('should remove a movie from anime when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const releaseDate = new Date();
      const anime = await createTestAnime(category.id, [genre.id], {
        animeType: 'movie',
        movies: [
          {
            title: 'Movie to Keep',
            releaseDate: new Date(),
          },
          {
            title: 'Movie to Remove',
            releaseDate: releaseDate,
          },
        ],
      });

      const response = await request(app)
        .delete(`/api/animes/${anime.id}/movies`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'Movie to Remove',
          releaseDate: releaseDate.toISOString(),
        })
        .expect(200);

      expect(response.body.movies).toHaveLength(1);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .delete(`/api/animes/${anime.id}/movies`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          name: 'Movie',
          releaseDate: new Date().toISOString(),
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV/movies')
        .send({
          name: 'Movie',
          releaseDate: new Date().toISOString(),
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/animes/:id/seasons', () => {
    it('should add a season to anime when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id], {
        animeType: 'serie',
        seasons: [{ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 12 }],
      });

      const response = await request(app)
        .post(`/api/animes/${anime.id}/seasons`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          seasonNumber: 2,
          releaseDate: new Date().toISOString(),
          totalEpisodes: 12,
        })
        .expect(200);

      expect(response.body.seasons).toHaveLength(2);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .post(`/api/animes/${anime.id}/seasons`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          seasonNumber: 1,
          releaseDate: new Date().toISOString(),
          totalEpisodes: 12,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when anime does not exist', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .post('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV/seasons')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          seasonNumber: 1,
          releaseDate: new Date().toISOString(),
          totalEpisodes: 12,
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV/seasons')
        .send({
          seasonNumber: 1,
          releaseDate: new Date().toISOString(),
          totalEpisodes: 12,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/animes/:id/seasons', () => {
    it('should remove a season from anime when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const releaseDate = new Date();
      const anime = await createTestAnime(category.id, [genre.id], {
        animeType: 'serie',
        seasons: [
          {
            seasonNumber: 1,
            releaseDate: new Date(),
            totalEpisodes: 12,
          },
          {
            seasonNumber: 2,
            releaseDate: releaseDate,
            totalEpisodes: 12,
          },
        ],
      });

      const response = await request(app)
        .delete(`/api/animes/${anime.id}/seasons`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          seasonNumber: 2,
          releaseDate: releaseDate.toISOString(),
          totalEpisodes: 12,
        })
        .expect(200);

      expect(response.body.seasons).toHaveLength(1);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .delete(`/api/animes/${anime.id}/seasons`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          seasonNumber: 1,
          releaseDate: new Date().toISOString(),
          totalEpisodes: 12,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV/seasons')
        .send({
          seasonNumber: 1,
          releaseDate: new Date().toISOString(),
          totalEpisodes: 12,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/animes/:id/genres', () => {
    it('should add a genre to anime when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre1 = await createTestGenre();
      const genre2 = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre1.id]);

      const response = await request(app)
        .post(`/api/animes/${anime.id}/genres`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          genreId: genre2.id,
        })
        .expect(200);

      expect(response.body.genres).toHaveLength(2);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre1 = await createTestGenre();
      const genre2 = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre1.id]);

      const response = await request(app)
        .post(`/api/animes/${anime.id}/genres`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          genreId: genre2.id,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when genre does not exist', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre.id]);

      const response = await request(app)
        .post(`/api/animes/${anime.id}/genres`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          genreId: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV/genres')
        .send({
          genreId: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/animes/:id/genres/:genreId', () => {
    it('should remove a genre from anime when admin', async () => {
      const admin = await createTestAdmin();
      const category = await createTestCategory();
      const genre1 = await createTestGenre();
      const genre2 = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre1.id, genre2.id]);

      const response = await request(app)
        .delete(`/api/animes/${anime.id}/genres/${genre2.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.genres).toHaveLength(1);
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();
      const category = await createTestCategory();
      const genre1 = await createTestGenre();
      const genre2 = await createTestGenre();
      const anime = await createTestAnime(category.id, [genre1.id, genre2.id]);

      const response = await request(app)
        .delete(`/api/animes/${anime.id}/genres/${genre2.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when anime does not exist', async () => {
      const admin = await createTestAdmin();
      const genre = await createTestGenre();

      const response = await request(app)
        .delete(`/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV/genres/${genre.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/animes/01ARZ3NDEKTSV4RRFFQ69G5FAV/genres/01ARZ3NDEKTSV4RRFFQ69G5FAV')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});
