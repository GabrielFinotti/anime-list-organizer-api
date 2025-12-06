import { CreateCategoryUseCase } from '../../../../../src/application/use-cases/category/create-category.use-case';
import { ICategoryRepository } from '../../../../../src/domain/repositories/category.repository';
import Category from '../../../../../src/domain/entities/Category.entity';
import { ConflictError } from '../../../../../src/application/errors';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    mockCategoryRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateCategoryUseCase(mockCategoryRepository);
  });

  it('should create a category successfully', async () => {
    const input = {
      name: 'Action',
      translatedName: 'Ação',
      targetAudience: 'General',
      description: 'Action category description',
    };

    mockCategoryRepository.findByName.mockResolvedValue(null);
    mockCategoryRepository.create.mockResolvedValue();

    const result = await useCase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(input.name.toLowerCase());
    expect(result.translatedName).toBe(input.translatedName.toLowerCase());
    expect(result.targetAudience).toBe(input.targetAudience.toLowerCase());
    expect(result.description).toBe(input.description);
    expect(mockCategoryRepository.findByName).toHaveBeenCalledWith(input.name.toLowerCase());
    expect(mockCategoryRepository.create).toHaveBeenCalled();
  });

  it('should throw ConflictError when category name already exists', async () => {
    const input = {
      name: 'Action',
      translatedName: 'Ação',
      targetAudience: 'General',
      description: 'Action category description',
    };

    const existingCategory = Category.create('Action', 'Ação', 'General', 'Existing description');
    mockCategoryRepository.findByName.mockResolvedValue(existingCategory);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
    await expect(useCase.execute(input)).rejects.toThrow("Category with name 'action' already exists");
    expect(mockCategoryRepository.create).not.toHaveBeenCalled();
  });
});
