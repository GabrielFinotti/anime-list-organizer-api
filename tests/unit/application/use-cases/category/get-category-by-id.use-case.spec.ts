import { GetCategoryByIdUseCase } from '../../../../../src/application/use-cases/category/get-category-by-id.use-case';
import { ICategoryRepository } from '../../../../../src/domain/repositories/category.repository';
import Category from '../../../../../src/domain/entities/Category.entity';
import { NotFoundError } from '../../../../../src/application/errors';

describe('GetCategoryByIdUseCase', () => {
  let useCase: GetCategoryByIdUseCase;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    mockCategoryRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetCategoryByIdUseCase(mockCategoryRepository);
  });

  it('should return a category when found', async () => {
    const category = Category.create('Action', 'Action description');
    mockCategoryRepository.findById.mockResolvedValue(category);

    const result = await useCase.execute(category.id.value);

    expect(result.id).toBe(category.id.value);
    expect(result.name).toBe('action');
    expect(result.description).toBe('Action description');
    expect(mockCategoryRepository.findById).toHaveBeenCalledWith(category.id.value);
  });

  it('should throw NotFoundError when category not found', async () => {
    const categoryId = 'non-existent-id';
    mockCategoryRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(categoryId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(categoryId)).rejects.toThrow(
      `Category with identifier '${categoryId}' not found`,
    );
  });
});
