import Category from '../../domain/entities/Category.entity.js';
import { CategoryOutputDTO } from '../dtos/category.dto.js';

type CategoryDocument = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

class CategoryMapper {
  static toPersistence(category: Category) {
    return {
      _id: category.id.value,
      name: category.name.value,
      description: category.description.value,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  static toDomain(doc: CategoryDocument) {
    return Category.toDomain({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toResponse(category: Category): CategoryOutputDTO {
    return {
      id: category.id.value,
      name: category.name.value,
      description: category.description.value,
    };
  }
}

export default CategoryMapper;
