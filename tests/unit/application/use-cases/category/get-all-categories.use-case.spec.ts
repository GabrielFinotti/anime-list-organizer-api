import { GetAllCategoriesUseCase } from '../../../../../src/application/use-cases/category/get-all-categories.use-case';
import { ICategoryRepository } from '../../../../../src/domain/repositories/category.repository';
import Category from '../../../../../src/domain/entities/Category.entity';

describe('GetAllCategoriesUseCase', () => {
  let useCase: GetAllCategoriesUseCase;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    mockCategoryRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetAllCategoriesUseCase(mockCategoryRepository);
  });

  it('should return all categories', async () => {
    const categories = [
      Category.create('Action', 'Action', 'General', 'Action description'),
      Category.create('Comedy', 'Comedy', 'General', 'Comedy description'),
      Category.create('Drama', 'Drama', 'General', 'Drama description'),
    ];

    mockCategoryRepository.findAll.mockResolvedValue(categories);

    const result = await useCase.execute();

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('action');
    expect(result[1].name).toBe('comedy');
    expect(result[2].name).toBe('drama');
    expect(mockCategoryRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no categories exist', async () => {
    mockCategoryRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});
