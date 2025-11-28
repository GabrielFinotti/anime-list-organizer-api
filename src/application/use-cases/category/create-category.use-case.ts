import { ICategoryRepository } from '../../../domain/repositories/category.repository.js';
import Category from '../../../domain/entities/Category.entity.js';
import { CategoryInputDTO, CategoryOutputDTO } from '../../dtos/category.dto.js';
import CategoryMapper from '../../mappers/category.mapper.js';
import { ConflictError } from '../../errors/index.js';

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CategoryInputDTO): Promise<CategoryOutputDTO> {
    const existingCategory = await this.categoryRepository.findByName(
      input.name,
    );

    if (existingCategory) {
      throw new ConflictError('Category', 'name', input.name);
    }

    const category = Category.create(input.name, input.description);

    await this.categoryRepository.create(category);

    return CategoryMapper.toResponse(category);
  }
}

export default CreateCategoryUseCase;
