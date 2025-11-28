import { DeleteCategoryUseCase } from '../../../../../src/application/use-cases/category/delete-category.use-case';
import { ICategoryRepository } from '../../../../../src/domain/repositories/category.repository';
import Category from '../../../../../src/domain/entities/Category.entity';
import { NotFoundError } from '../../../../../src/application/errors';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    mockCategoryRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteCategoryUseCase(mockCategoryRepository);
  });

  it('should delete a category successfully', async () => {
    const category = Category.create('Action', 'Action description');
    mockCategoryRepository.findById.mockResolvedValue(category);
    mockCategoryRepository.delete.mockResolvedValue();

    await useCase.execute(category.id.value);

    expect(mockCategoryRepository.findById).toHaveBeenCalledWith(category.id.value);
    expect(mockCategoryRepository.delete).toHaveBeenCalledWith(category.id.value);
  });

  it('should throw NotFoundError when category not found', async () => {
    const categoryId = 'non-existent-id';
    mockCategoryRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(categoryId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(categoryId)).rejects.toThrow(
      `Category with identifier '${categoryId}' not found`,
    );
    expect(mockCategoryRepository.delete).not.toHaveBeenCalled();
  });
});
