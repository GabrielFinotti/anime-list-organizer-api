import Category from '../../domain/entities/Category.entity.js';
import { CategoryOutputDTO } from '../dtos/category.dto.js';

class CategoryMapper {
  static toResponse(category: Category): CategoryOutputDTO {
    return {
      id: category.id.value,
      name: category.name.value,
      translatedName: category.translatedName.value,
      targetAudience: category.targetAudience.value,
      description: category.description.value,
    };
  }
}

export default CategoryMapper;
