import { ICategoryRepository } from '../../../domain/repositories/category.repository.js';
import { CategoryOutputDTO } from '../../dtos/category.dto.js';
import CategoryMapper from '../../mappers/category.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<CategoryOutputDTO> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError('Category', id);
    }

    return CategoryMapper.toResponse(category);
  }
}

export default GetCategoryByIdUseCase;
