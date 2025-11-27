import Category from '../../domain/entities/Category.entity.js';

export type CategoryDocument = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

class CategoryPersistenceMapper {
  static toDomain(doc: CategoryDocument): Category {
    return Category.toDomain({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(category: Category): CategoryDocument {
    return {
      _id: category.id.value,
      name: category.name.value,
      description: category.description.value,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}

export default CategoryPersistenceMapper;
