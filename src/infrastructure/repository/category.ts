import { ICategoryRepository } from "../../domain/repository/category.js";

class CategoryRepositoryImpl implements ICategoryRepository {
  async findById(id: string) {}

  async findByName(name: string) {}

  async findAll() {}

  async create(category: any) {}

  async delete(id: string) {}
}

export default CategoryRepositoryImpl;
