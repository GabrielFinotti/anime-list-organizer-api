import { ICategoryRepository } from '../../../domain/repositories/category.repository.js';
import { CategoryOutputDTO } from '../../dtos/category.dto.js';
import CategoryMapper from '../../mappers/category.mapper.js';

export class GetAllCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(): Promise<CategoryOutputDTO[]> {
    const categories = await this.categoryRepository.findAll();

    return categories.map(CategoryMapper.toResponse);
  }
}

export default GetAllCategoriesUseCase;
