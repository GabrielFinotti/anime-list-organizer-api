import Category from "../../domain/entity/Category.js";

type CategoryDocument = {
  _id: string;
  name: string;
  description: string;
  targetAudience: string;
  createdAt: Date;
  updatedAt: Date;
};

class CategoryPersistenceMapper {
  static toDomain(doc: CategoryDocument) {
    return Category.fromPersistence(doc);
  }

  static toPersistence(category: Category) {
    return {
      _id: category.id.value,
      name: category.name.value,
      description: category.description.value,
      targetAudience: category.targetAudience.value,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}

export default CategoryPersistenceMapper;
