import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import GenreModel from '../../../../../src/infrastructure/database/models/genre.model';

describe('GenreModel', () => {
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
    await GenreModel.deleteMany({});
  });

  const validGenreData = {
    _id: 'genre-123',
    name: 'Action',
    description: 'Fast-paced with fighting and physical feats',
    isAdultContent: false,
  };

  describe('create', () => {
    it('should create a genre with valid data', async () => {
      const genre = await GenreModel.create(validGenreData);

      expect(genre._id).toBe(validGenreData._id);
      expect(genre.name).toBe(validGenreData.name);
      expect(genre.description).toBe(validGenreData.description);
      expect(genre.isAdultContent).toBe(validGenreData.isAdultContent);
    });

    it('should create timestamps automatically', async () => {
      const genre = await GenreModel.create(validGenreData) as any;

      expect(genre.createdAt).toBeDefined();
      expect(genre.updatedAt).toBeDefined();
    });

    it('should create genre with isAdultContent true', async () => {
      const adultGenre = {
        _id: 'genre-adult',
        name: 'Ecchi',
        description: 'Mildly erotic content',
        isAdultContent: true,
      };

      const genre = await GenreModel.create(adultGenre);

      expect(genre.isAdultContent).toBe(true);
    });

    it('should fail when _id is missing', async () => {
      const invalidData = {
        name: 'Test Genre',
        description: 'Test description',
        isAdultContent: false,
      };

      await expect(GenreModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail when name is missing', async () => {
      const invalidData = {
        _id: 'genre-invalid',
        description: 'Test description',
        isAdultContent: false,
      };

      await expect(GenreModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail when description is missing', async () => {
      const invalidData = {
        _id: 'genre-invalid',
        name: 'Test Genre',
        isAdultContent: false,
      };

      await expect(GenreModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail when isAdultContent is missing', async () => {
      const invalidData = {
        _id: 'genre-invalid',
        name: 'Test Genre',
        description: 'Test description',
      };

      await expect(GenreModel.create(invalidData)).rejects.toThrow();
    });

    it('should enforce unique _id', async () => {
      await GenreModel.create(validGenreData);

      const duplicateData = {
        ...validGenreData,
        name: 'Different Name',
      };

      await expect(GenreModel.create(duplicateData)).rejects.toThrow();
    });
  });

  describe('find operations', () => {
    beforeEach(async () => {
      await GenreModel.create(validGenreData);
    });

    it('should find genre by id', async () => {
      const genre = await GenreModel.findById(validGenreData._id);

      expect(genre).not.toBeNull();
      expect(genre!.name).toBe(validGenreData.name);
    });

    it('should find genre by name', async () => {
      const genre = await GenreModel.findOne({ name: validGenreData.name });

      expect(genre).not.toBeNull();
      expect(genre!._id).toBe(validGenreData._id);
    });

    it('should find genres by isAdultContent', async () => {
      await GenreModel.create({
        _id: 'genre-adult-1',
        name: 'Ecchi',
        description: 'Adult content',
        isAdultContent: true,
      });

      const adultGenres = await GenreModel.find({ isAdultContent: true });
      const nonAdultGenres = await GenreModel.find({ isAdultContent: false });

      expect(adultGenres).toHaveLength(1);
      expect(nonAdultGenres).toHaveLength(1);
    });

    it('should return all genres', async () => {
      await GenreModel.create({
        _id: 'genre-456',
        name: 'Adventure',
        description: 'Journey and exploration',
        isAdultContent: false,
      });

      const genres = await GenreModel.find();

      expect(genres).toHaveLength(2);
    });

    it('should return null for non-existent genre', async () => {
      const genre = await GenreModel.findById('non-existent-id');

      expect(genre).toBeNull();
    });
  });

  describe('update operations', () => {
    beforeEach(async () => {
      await GenreModel.create(validGenreData);
    });

    it('should update genre description', async () => {
      await GenreModel.updateOne(
        { _id: validGenreData._id },
        { description: 'Updated description' }
      );

      const genre = await GenreModel.findById(validGenreData._id);
      expect(genre!.description).toBe('Updated description');
    });

    it('should update genre name', async () => {
      await GenreModel.updateOne(
        { _id: validGenreData._id },
        { name: 'Updated Name' }
      );

      const genre = await GenreModel.findById(validGenreData._id);
      expect(genre!.name).toBe('Updated Name');
    });

    it('should update isAdultContent flag', async () => {
      await GenreModel.updateOne(
        { _id: validGenreData._id },
        { isAdultContent: true }
      );

      const genre = await GenreModel.findById(validGenreData._id);
      expect(genre!.isAdultContent).toBe(true);
    });

    it('should update updatedAt on modification', async () => {
      const original = await GenreModel.findById(validGenreData._id) as any;
      const originalUpdatedAt = original!.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      await GenreModel.updateOne(
        { _id: validGenreData._id },
        { description: 'New description' }
      );

      const updated = await GenreModel.findById(validGenreData._id) as any;
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('delete operations', () => {
    beforeEach(async () => {
      await GenreModel.create(validGenreData);
    });

    it('should delete genre by id', async () => {
      await GenreModel.deleteOne({ _id: validGenreData._id });

      const genre = await GenreModel.findById(validGenreData._id);
      expect(genre).toBeNull();
    });

    it('should delete all genres', async () => {
      await GenreModel.create({
        _id: 'genre-456',
        name: 'Adventure',
        description: 'Another genre',
        isAdultContent: false,
      });

      await GenreModel.deleteMany({});

      const genres = await GenreModel.find();
      expect(genres).toHaveLength(0);
    });
  });

  describe('multiple genres', () => {
    it('should create multiple genres', async () => {
      const genres = [
        { _id: 'genre-1', name: 'Action', description: 'Action packed', isAdultContent: false },
        { _id: 'genre-2', name: 'Adventure', description: 'Exploration', isAdultContent: false },
        { _id: 'genre-3', name: 'Comedy', description: 'Funny', isAdultContent: false },
        { _id: 'genre-4', name: 'Drama', description: 'Emotional', isAdultContent: false },
        { _id: 'genre-5', name: 'Ecchi', description: 'Mild adult', isAdultContent: true },
      ];

      for (const genreData of genres) {
        await GenreModel.create(genreData);
      }

      const allGenres = await GenreModel.find();
      expect(allGenres).toHaveLength(5);

      const adultGenres = await GenreModel.find({ isAdultContent: true });
      expect(adultGenres).toHaveLength(1);
    });
  });
});
