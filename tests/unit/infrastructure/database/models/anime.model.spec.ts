import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import AnimeModel from '../../../../../src/infrastructure/database/models/anime.model';

describe('AnimeModel', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await AnimeModel.deleteMany({});
  });

  const validAnimeData = {
    _id: 'anime-123',
    imageUrl: 'https://example.com/image.jpg',
    name: 'Naruto',
    synopsis: 'A ninja story',
    category: 'category-123',
    genres: ['genre-1', 'genre-2'],
    animeType: 'serie' as const,
    productionType: 'original' as const,
    movies: [],
    seasons: [],
    isAdultContent: false,
  };

  describe('create', () => {
    it('should create an anime with valid data', async () => {
      const anime = await AnimeModel.create(validAnimeData);

      expect(anime._id).toBe(validAnimeData._id);
      expect(anime.name).toBe(validAnimeData.name);
      expect(anime.synopsis).toBe(validAnimeData.synopsis);
      expect(anime.category).toBe(validAnimeData.category);
      expect(anime.genres).toEqual(validAnimeData.genres);
      expect(anime.animeType).toBe(validAnimeData.animeType);
      expect(anime.productionType).toBe(validAnimeData.productionType);
      expect(anime.isAdultContent).toBe(validAnimeData.isAdultContent);
    });

    it('should create an anime with movies', async () => {
      const animeWithMovies = {
        ...validAnimeData,
        _id: 'anime-with-movies',
        name: 'Anime with Movies',
        movies: [
          { title: 'Movie 1', releaseDate: new Date('2020-01-01') },
          { title: 'Movie 2', releaseDate: new Date('2021-01-01') },
        ],
      };

      const anime = await AnimeModel.create(animeWithMovies);

      expect(anime.movies).toHaveLength(2);
      expect(anime.movies[0].title).toBe('Movie 1');
      expect(anime.movies[1].title).toBe('Movie 2');
    });

    it('should create an anime with seasons', async () => {
      const animeWithSeasons = {
        ...validAnimeData,
        _id: 'anime-with-seasons',
        name: 'Anime with Seasons',
        seasons: [
          { seasonNumber: 1, releaseDate: new Date('2020-01-01'), totalEpisodes: 12 },
          { seasonNumber: 2, releaseDate: new Date('2021-01-01'), totalEpisodes: 24 },
        ],
      };

      const anime = await AnimeModel.create(animeWithSeasons);

      expect(anime.seasons).toHaveLength(2);
      expect(anime.seasons[0].seasonNumber).toBe(1);
      expect(anime.seasons[0].totalEpisodes).toBe(12);
      expect(anime.seasons[1].seasonNumber).toBe(2);
      expect(anime.seasons[1].totalEpisodes).toBe(24);
    });

    it('should create timestamps automatically', async () => {
      const anime = await AnimeModel.create(validAnimeData) as any;

      expect(anime.createdAt).toBeDefined();
      expect(anime.updatedAt).toBeDefined();
    });

    it('should fail when required fields are missing', async () => {
      const invalidData = {
        _id: 'invalid-anime',
        name: 'Invalid Anime',
      };

      await expect(AnimeModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail with invalid animeType', async () => {
      const invalidData = {
        ...validAnimeData,
        _id: 'invalid-type',
        name: 'Invalid Type Anime',
        animeType: 'invalid' as any,
      };

      await expect(AnimeModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail with invalid productionType', async () => {
      const invalidData = {
        ...validAnimeData,
        _id: 'invalid-production',
        name: 'Invalid Production Anime',
        productionType: 'invalid' as any,
      };

      await expect(AnimeModel.create(invalidData)).rejects.toThrow();
    });

    it('should enforce unique name', async () => {
      await AnimeModel.create(validAnimeData);

      const duplicateData = {
        ...validAnimeData,
        _id: 'anime-duplicate',
      };

      await expect(AnimeModel.create(duplicateData)).rejects.toThrow();
    });
  });

  describe('animeType enum', () => {
    it('should accept serie type', async () => {
      const anime = await AnimeModel.create({
        ...validAnimeData,
        _id: 'serie-anime',
        name: 'Serie Anime',
        animeType: 'serie',
      });

      expect(anime.animeType).toBe('serie');
    });

    it('should accept movie type', async () => {
      const anime = await AnimeModel.create({
        ...validAnimeData,
        _id: 'movie-anime',
        name: 'Movie Anime',
        animeType: 'movie',
      });

      expect(anime.animeType).toBe('movie');
    });

    it('should accept mixed type', async () => {
      const anime = await AnimeModel.create({
        ...validAnimeData,
        _id: 'mixed-anime',
        name: 'Mixed Anime',
        animeType: 'mixed',
      });

      expect(anime.animeType).toBe('mixed');
    });
  });

  describe('productionType enum', () => {
    it('should accept original type', async () => {
      const anime = await AnimeModel.create({
        ...validAnimeData,
        _id: 'original-anime',
        name: 'Original Anime',
        productionType: 'original',
      });

      expect(anime.productionType).toBe('original');
    });

    it('should accept adaptation type', async () => {
      const anime = await AnimeModel.create({
        ...validAnimeData,
        _id: 'adaptation-anime',
        name: 'Adaptation Anime',
        productionType: 'adaptation',
      });

      expect(anime.productionType).toBe('adaptation');
    });
  });

  describe('find operations', () => {
    beforeEach(async () => {
      await AnimeModel.create(validAnimeData);
    });

    it('should find anime by id', async () => {
      const anime = await AnimeModel.findById(validAnimeData._id);

      expect(anime).not.toBeNull();
      expect(anime!.name).toBe(validAnimeData.name);
    });

    it('should find anime by name', async () => {
      const anime = await AnimeModel.findOne({ name: validAnimeData.name });

      expect(anime).not.toBeNull();
      expect(anime!._id).toBe(validAnimeData._id);
    });

    it('should return null for non-existent anime', async () => {
      const anime = await AnimeModel.findById('non-existent-id');

      expect(anime).toBeNull();
    });
  });

  describe('update operations', () => {
    beforeEach(async () => {
      await AnimeModel.create(validAnimeData);
    });

    it('should update anime fields', async () => {
      await AnimeModel.updateOne(
        { _id: validAnimeData._id },
        { synopsis: 'Updated synopsis' }
      );

      const anime = await AnimeModel.findById(validAnimeData._id);
      expect(anime!.synopsis).toBe('Updated synopsis');
    });

    it('should update updatedAt on modification', async () => {
      const original = await AnimeModel.findById(validAnimeData._id) as any;
      const originalUpdatedAt = original!.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      await AnimeModel.updateOne(
        { _id: validAnimeData._id },
        { synopsis: 'New synopsis' }
      );

      const updated = await AnimeModel.findById(validAnimeData._id) as any;
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('delete operations', () => {
    beforeEach(async () => {
      await AnimeModel.create(validAnimeData);
    });

    it('should delete anime by id', async () => {
      await AnimeModel.deleteOne({ _id: validAnimeData._id });

      const anime = await AnimeModel.findById(validAnimeData._id);
      expect(anime).toBeNull();
    });
  });
});
