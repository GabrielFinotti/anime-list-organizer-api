// Setup environment variables BEFORE any imports
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.MONGO_URI = 'mongodb://localhost:27017';
process.env.MONGO_NAME = 'test_db';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.SECRET_KEY = 'test-secret-key';
process.env.TOKEN_EXPIRATION = '1h';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Mock do serviço de lookup
const mockGetAnimeData = jest.fn();

jest.mock('../../../src/infrastructure/api/gpt/service/lookupAnime.service', () => {
  return jest.fn().mockImplementation(() => ({
    getAnimeData: mockGetAnimeData,
  }));
});

// Mock do ioredis
jest.mock('ioredis', () => {
  const RedisMock = require('ioredis-mock');
  return {
    Redis: RedisMock,
    default: RedisMock,
  };
});

import request from 'supertest';
import app from '../../../src/app';
import { createTestAdmin, createTestUser, createTestCategory, createTestGenre } from '../setup';

describe('Anime Lookup Routes - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/animes/lookup', () => {
    const mockLookupResponse = {
      anime: {
        name: 'Naruto',
        synopsis:
          'Uma história sobre um ninja chamado Naruto Uzumaki que sonha em se tornar Hokage',
        category: 'Shounen',
        genres: ['Action', 'Adventure'],
        animeType: 'serie',
        productionType: 'adaptation',
        movies: [{ title: 'Naruto the Movie', releaseDate: new Date('2004-08-21') }],
        seasons: [{ seasonNumber: 1, releaseDate: new Date('2002-10-03'), totalEpisodes: 220 }],
        isAdultContent: false,
      },
      observedDetails: [],
    };

    it('should return anime data when admin provides valid title', async () => {
      const admin = await createTestAdmin();
      await createTestCategory({ name: 'Shounen' });
      await createTestGenre({ name: 'Action' });

      mockGetAnimeData.mockResolvedValue(mockLookupResponse);

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Naruto' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('anime');
      expect(response.body.anime.name).toBe('Naruto');
      expect(response.body.anime.synopsis).toContain('ninja');
      expect(response.body.anime.animeType).toBe('serie');
    });

    it('should return 401 when user is not admin', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Naruto' })
        .set('Authorization', `Bearer ${user.token}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(mockGetAnimeData).not.toHaveBeenCalled();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Naruto' })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(mockGetAnimeData).not.toHaveBeenCalled();
    });

    it('should return 500 when title is not provided', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .get('/api/animes/lookup')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 when title is empty', async () => {
      const admin = await createTestAdmin();

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: '' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return anime data with movie type', async () => {
      const admin = await createTestAdmin();

      const movieResponse = {
        anime: {
          name: 'Your Name',
          synopsis: 'Uma história de amor entre dois adolescentes que trocam de corpos',
          category: 'Romance',
          genres: ['Romance', 'Drama', 'Fantasy'],
          animeType: 'movie',
          productionType: 'original',
          movies: [{ title: 'Your Name', releaseDate: new Date('2016-08-26') }],
          seasons: [],
          isAdultContent: false,
        },
        observedDetails: [],
      };

      mockGetAnimeData.mockResolvedValue(movieResponse);

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Your Name' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.anime.animeType).toBe('movie');
      expect(response.body.anime.movies).toHaveLength(1);
      expect(response.body.anime.seasons).toHaveLength(0);
    });

    it('should return anime data with mixed type', async () => {
      const admin = await createTestAdmin();

      const mixedResponse = {
        anime: {
          name: 'Dragon Ball Z',
          synopsis: 'Goku e seus amigos protegem a Terra de vilões poderosos',
          category: 'Shounen',
          genres: ['Action', 'Adventure'],
          animeType: 'mixed',
          productionType: 'adaptation',
          movies: [{ title: 'Dragon Ball Z: Dead Zone', releaseDate: new Date('1989-07-15') }],
          seasons: [{ seasonNumber: 1, releaseDate: new Date('1989-04-26'), totalEpisodes: 39 }],
          isAdultContent: false,
        },
        observedDetails: [],
      };

      mockGetAnimeData.mockResolvedValue(mixedResponse);

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Dragon Ball Z' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.anime.animeType).toBe('mixed');
      expect(response.body.anime.movies.length).toBeGreaterThanOrEqual(1);
      expect(response.body.anime.seasons.length).toBeGreaterThanOrEqual(1);
    });

    it('should return anime data with observed details', async () => {
      const admin = await createTestAdmin();

      const incompleteResponse = {
        anime: {
          name: 'Unknown Anime',
          synopsis: '',
          category: '',
          genres: [],
          animeType: 'serie',
          productionType: 'original',
          movies: [],
          seasons: [],
          isAdultContent: false,
        },
        observedDetails: ['synopsis', 'category', 'genres', 'seasons'],
      };

      mockGetAnimeData.mockResolvedValue(incompleteResponse);

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Unknown Anime' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.observedDetails).toContain('synopsis');
      expect(response.body.observedDetails).toContain('category');
    });

    it('should return adult content anime data', async () => {
      const admin = await createTestAdmin();

      const adultResponse = {
        anime: {
          name: 'Adult Anime',
          synopsis: 'Um anime para adultos',
          category: 'Seinen',
          genres: ['Action', 'Ecchi'],
          animeType: 'serie',
          productionType: 'original',
          movies: [],
          seasons: [{ seasonNumber: 1, releaseDate: new Date('2020-01-01'), totalEpisodes: 12 }],
          isAdultContent: true,
        },
        observedDetails: [],
      };

      mockGetAnimeData.mockResolvedValue(adultResponse);

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Adult Anime' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.anime.isAdultContent).toBe(true);
    });

    it('should return 500 when lookup service fails', async () => {
      const admin = await createTestAdmin();

      mockGetAnimeData.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Test' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle special characters in title', async () => {
      const admin = await createTestAdmin();

      const response1 = {
        anime: {
          name: 'Re:Zero - Starting Life in Another World',
          synopsis: 'Um jovem é transportado para outro mundo',
          category: 'Isekai',
          genres: ['Fantasy', 'Drama'],
          animeType: 'serie',
          productionType: 'adaptation',
          movies: [],
          seasons: [{ seasonNumber: 1, releaseDate: new Date('2016-04-04'), totalEpisodes: 25 }],
          isAdultContent: false,
        },
        observedDetails: [],
      };

      mockGetAnimeData.mockResolvedValue(response1);

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Re:Zero - Starting Life in Another World' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.anime.name).toBe('Re:Zero - Starting Life in Another World');
    });

    it('should handle anime with multiple seasons', async () => {
      const admin = await createTestAdmin();

      const multiSeasonResponse = {
        anime: {
          name: 'Attack on Titan',
          synopsis: 'A humanidade luta pela sobrevivência contra titãs gigantes',
          category: 'Shounen',
          genres: ['Action', 'Drama', 'Horror'],
          animeType: 'serie',
          productionType: 'adaptation',
          movies: [],
          seasons: [
            { seasonNumber: 1, releaseDate: new Date('2013-04-07'), totalEpisodes: 25 },
            { seasonNumber: 2, releaseDate: new Date('2017-04-01'), totalEpisodes: 12 },
            { seasonNumber: 3, releaseDate: new Date('2018-07-23'), totalEpisodes: 22 },
            { seasonNumber: 4, releaseDate: new Date('2020-12-07'), totalEpisodes: 28 },
          ],
          isAdultContent: false,
        },
        observedDetails: [],
      };

      mockGetAnimeData.mockResolvedValue(multiSeasonResponse);

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Attack on Titan' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.anime.seasons).toHaveLength(4);
    });

    it('should handle anime with multiple movies', async () => {
      const admin = await createTestAdmin();

      const multiMovieResponse = {
        anime: {
          name: 'Demon Slayer',
          synopsis: 'Tanjiro luta contra demônios para salvar sua irmã',
          category: 'Shounen',
          genres: ['Action', 'Adventure', 'Supernatural'],
          animeType: 'mixed',
          productionType: 'adaptation',
          movies: [
            { title: 'Demon Slayer: Mugen Train', releaseDate: new Date('2020-10-16') },
            {
              title: 'Demon Slayer: To the Swordsmith Village',
              releaseDate: new Date('2023-02-03'),
            },
          ],
          seasons: [{ seasonNumber: 1, releaseDate: new Date('2019-04-06'), totalEpisodes: 26 }],
          isAdultContent: false,
        },
        observedDetails: [],
      };

      mockGetAnimeData.mockResolvedValue(multiMovieResponse);

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Demon Slayer' })
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.anime.movies).toHaveLength(2);
    });

    it('should return 401 with expired token', async () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDAwMDF9.invalid';

      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Naruto' })
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with invalid token format', async () => {
      const response = await request(app)
        .get('/api/animes/lookup')
        .query({ title: 'Naruto' })
        .set('Authorization', 'InvalidTokenFormat')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});
