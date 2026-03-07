import Category from "../../domain/entity/Category.js";
import { ICategoryRepository } from "../../domain/repository/category.js";
import CategoryModel from "../database/models/category.js";
import CategoryPersistenceMapper, {
  CategoryDocument,
} from "../mapper/category.js";

class CategoryRepositoryImpl implements ICategoryRepository {
  private constructor() {}

  async findById(id: string) {
    const category = await CategoryModel.findById(id).lean<CategoryDocument>();

    return category ? CategoryPersistenceMapper.toDomain(category) : null;
  }

  async findByName(name: string) {
    const category = await CategoryModel.findOne({
      name,
    }).lean<CategoryDocument>();

    return category ? CategoryPersistenceMapper.toDomain(category) : null;
  }

  async findAll() {
    const categories = await CategoryModel.find().lean<CategoryDocument[]>();

    return categories.map((doc) => CategoryPersistenceMapper.toDomain(doc));
  }

  async create(category: Category) {
    await CategoryModel.create(
      CategoryPersistenceMapper.toPersistence(category),
    );
  }

  async delete(id: string) {
    await CategoryModel.findByIdAndDelete(id);
  }
}

export default CategoryRepositoryImpl;
