import Category from '../../domain/entities/Category.entity.js';
import { CategoryOutputDTO } from '../dtos/category.dto.js';

class CategoryMapper {
  static toResponse(category: Category): CategoryOutputDTO {
    return {
      id: category.id.value,
      name: category.name.value,
      description: category.description.value,
    };
  }
}

export default CategoryMapper;
