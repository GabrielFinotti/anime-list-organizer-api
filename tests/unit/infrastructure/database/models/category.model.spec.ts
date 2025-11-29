import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import CategoryModel from '../../../../../src/infrastructure/database/models/category.model';

describe('CategoryModel', () => {
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
    await CategoryModel.deleteMany({});
  });

  const validCategoryData = {
    _id: 'category-123',
    name: 'Shonen',
    description: 'Anime targeted at young male audiences',
  };

  describe('create', () => {
    it('should create a category with valid data', async () => {
      const category = await CategoryModel.create(validCategoryData);

      expect(category._id).toBe(validCategoryData._id);
      expect(category.name).toBe(validCategoryData.name);
      expect(category.description).toBe(validCategoryData.description);
    });

    it('should create timestamps automatically', async () => {
      const category = await CategoryModel.create(validCategoryData) as any;

      expect(category.createdAt).toBeDefined();
      expect(category.updatedAt).toBeDefined();
    });

    it('should fail when _id is missing', async () => {
      const invalidData = {
        name: 'Test Category',
        description: 'Test description',
      };

      await expect(CategoryModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail when name is missing', async () => {
      const invalidData = {
        _id: 'category-invalid',
        description: 'Test description',
      };

      await expect(CategoryModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail when description is missing', async () => {
      const invalidData = {
        _id: 'category-invalid',
        name: 'Test Category',
      };

      await expect(CategoryModel.create(invalidData)).rejects.toThrow();
    });

    it('should enforce unique _id', async () => {
      await CategoryModel.create(validCategoryData);

      const duplicateData = {
        ...validCategoryData,
        name: 'Different Name',
      };

      await expect(CategoryModel.create(duplicateData)).rejects.toThrow();
    });
  });

  describe('find operations', () => {
    beforeEach(async () => {
      await CategoryModel.create(validCategoryData);
    });

    it('should find category by id', async () => {
      const category = await CategoryModel.findById(validCategoryData._id);

      expect(category).not.toBeNull();
      expect(category!.name).toBe(validCategoryData.name);
    });

    it('should find category by name', async () => {
      const category = await CategoryModel.findOne({ name: validCategoryData.name });

      expect(category).not.toBeNull();
      expect(category!._id).toBe(validCategoryData._id);
    });

    it('should return all categories', async () => {
      await CategoryModel.create({
        _id: 'category-456',
        name: 'Seinen',
        description: 'Anime targeted at adult male audiences',
      });

      const categories = await CategoryModel.find();

      expect(categories).toHaveLength(2);
    });

    it('should return null for non-existent category', async () => {
      const category = await CategoryModel.findById('non-existent-id');

      expect(category).toBeNull();
    });
  });

  describe('update operations', () => {
    beforeEach(async () => {
      await CategoryModel.create(validCategoryData);
    });

    it('should update category fields', async () => {
      await CategoryModel.updateOne(
        { _id: validCategoryData._id },
        { description: 'Updated description' }
      );

      const category = await CategoryModel.findById(validCategoryData._id);
      expect(category!.description).toBe('Updated description');
    });

    it('should update name field', async () => {
      await CategoryModel.updateOne(
        { _id: validCategoryData._id },
        { name: 'Updated Name' }
      );

      const category = await CategoryModel.findById(validCategoryData._id);
      expect(category!.name).toBe('Updated Name');
    });

    it('should update updatedAt on modification', async () => {
      const original = await CategoryModel.findById(validCategoryData._id) as any;
      const originalUpdatedAt = original!.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      await CategoryModel.updateOne(
        { _id: validCategoryData._id },
        { description: 'New description' }
      );

      const updated = await CategoryModel.findById(validCategoryData._id) as any;
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('delete operations', () => {
    beforeEach(async () => {
      await CategoryModel.create(validCategoryData);
    });

    it('should delete category by id', async () => {
      await CategoryModel.deleteOne({ _id: validCategoryData._id });

      const category = await CategoryModel.findById(validCategoryData._id);
      expect(category).toBeNull();
    });

    it('should delete all categories', async () => {
      await CategoryModel.create({
        _id: 'category-456',
        name: 'Seinen',
        description: 'Another category',
      });

      await CategoryModel.deleteMany({});

      const categories = await CategoryModel.find();
      expect(categories).toHaveLength(0);
    });
  });

  describe('multiple categories', () => {
    it('should create multiple categories with different types', async () => {
      const categories = [
        { _id: 'cat-1', name: 'Shonen', description: 'Young male audience' },
        { _id: 'cat-2', name: 'Seinen', description: 'Adult male audience' },
        { _id: 'cat-3', name: 'Shoujo', description: 'Young female audience' },
        { _id: 'cat-4', name: 'Josei', description: 'Adult female audience' },
      ];

      for (const categoryData of categories) {
        await CategoryModel.create(categoryData);
      }

      const allCategories = await CategoryModel.find();
      expect(allCategories).toHaveLength(4);
    });
  });
});
