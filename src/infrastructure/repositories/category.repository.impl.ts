import Category from '../../domain/entities/Category.entity.js';
import { ICategoryRepository } from '../../domain/repositories/category.repository.js';
import CategoryPersistenceMapper, {
  CategoryDocument,
} from '../mappers/category.persistence-mapper.js';
import CategoryModel from '../database/models/category.model.js';

class CategoryRepositoryImpl implements ICategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const categoryDoc = await CategoryModel.findById(id).lean<CategoryDocument>();

    if (!categoryDoc) {
      return null;
    }

    return CategoryPersistenceMapper.toDomain(categoryDoc);
  }

  async findByName(name: string): Promise<Category | null> {
    const categoryDoc = await CategoryModel.findOne({ name }).lean<CategoryDocument>();

    if (!categoryDoc) {
      return null;
    }

    return CategoryPersistenceMapper.toDomain(categoryDoc);
  }

  async findAll(): Promise<Category[]> {
    const categoryDocs = await CategoryModel.find().lean<CategoryDocument[]>();

    return categoryDocs.map((doc) => CategoryPersistenceMapper.toDomain(doc));
  }

  async create(category: Category): Promise<void> {
    await CategoryModel.create(CategoryPersistenceMapper.toPersistence(category));
  }

  async delete(id: string): Promise<void> {
    await CategoryModel.findByIdAndDelete(id);
  }
}

export default CategoryRepositoryImpl;