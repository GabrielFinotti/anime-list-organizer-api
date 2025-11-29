import Category from '../../../../src/domain/entities/Category.entity';
import CategoryRepositoryImpl from '../../../../src/infrastructure/repositories/category.repository.impl';
import CategoryModel from '../../../../src/infrastructure/database/models/category.model';
import CategoryPersistenceMapper from '../../../../src/infrastructure/mappers/category.persistence-mapper';

jest.mock('../../../../src/infrastructure/database/models/category.model');

describe('CategoryRepositoryImpl', () => {
  let repository: CategoryRepositoryImpl;
  const mockCategoryDoc = {
    _id: '01KB3H4ZMD9J0NT3JQG8XTXWN0',
    name: 'shounen',
    description: 'Anime targeted at young male audiences',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new CategoryRepositoryImpl();
  });

  describe('findById', () => {
    it('should return a category when found', async () => {
      (CategoryModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCategoryDoc),
      });

      const result = await repository.findById(mockCategoryDoc._id);

      expect(CategoryModel.findById).toHaveBeenCalledWith(mockCategoryDoc._id);
      expect(result).not.toBeNull();
      expect(result?.id.value).toBe(mockCategoryDoc._id);
      expect(result?.name.value).toBe(mockCategoryDoc.name);
    });

    it('should return null when category not found', async () => {
      (CategoryModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return a category when found by name', async () => {
      (CategoryModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCategoryDoc),
      });

      const result = await repository.findByName('shounen');

      expect(CategoryModel.findOne).toHaveBeenCalledWith({ name: 'shounen' });
      expect(result).not.toBeNull();
      expect(result?.name.value).toBe(mockCategoryDoc.name);
    });

    it('should return null when category not found by name', async () => {
      (CategoryModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findByName('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const mockCategoryDocs = [
        mockCategoryDoc,
        {
          ...mockCategoryDoc,
          _id: '01KB3H4ZMG6MV4JQFN89N03J4G',
          name: 'seinen',
          description: 'Anime targeted at adult male audiences',
        },
      ];

      (CategoryModel.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCategoryDocs),
      });

      const result = await repository.findAll();

      expect(CategoryModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].name.value).toBe('shounen');
      expect(result[1].name.value).toBe('seinen');
    });

    it('should return empty array when no categories exist', async () => {
      (CategoryModel.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      });

      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      const category = Category.create('Shounen', 'Anime targeted at young male audiences');

      (CategoryModel.create as jest.Mock).mockResolvedValue(mockCategoryDoc);

      await repository.create(category);

      expect(CategoryModel.create).toHaveBeenCalledWith(
        CategoryPersistenceMapper.toPersistence(category),
      );
    });
  });

  describe('delete', () => {
    it('should delete a category by id', async () => {
      (CategoryModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCategoryDoc);

      await repository.delete(mockCategoryDoc._id);

      expect(CategoryModel.findByIdAndDelete).toHaveBeenCalledWith(mockCategoryDoc._id);
    });
  });
});
