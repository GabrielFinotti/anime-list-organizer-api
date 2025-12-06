import { ICategoryRepository } from '../../../domain/repositories/category.repository.js';
import Category from '../../../domain/entities/Category.entity.js';
import { CategoryInputDTO, CategoryOutputDTO } from '../../dtos/category.dto.js';
import CategoryMapper from '../../mappers/category.mapper.js';
import { ConflictError } from '../../errors/index.js';

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CategoryInputDTO): Promise<CategoryOutputDTO> {
    const category = Category.create(input.name, input.description);

    const existingCategory = await this.categoryRepository.findByName(category.name.value);

    if (existingCategory) {
      throw new ConflictError('Category', 'name', category.name.value);
    }

    await this.categoryRepository.create(category);

    return CategoryMapper.toResponse(category);
  }
}

export default CreateCategoryUseCase;
