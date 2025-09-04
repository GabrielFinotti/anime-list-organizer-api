import { CategoryDTO } from "@/interface/dto/category.dto";
import CategoryRepository from "@/repository/category.repository";

class CategoryService {
  constructor(private categoryRepository = new CategoryRepository()) {}

  async createCategory(category: CategoryDTO) {
    try {
      const existingCategory = await this.categoryRepository.findByName(
        category.name
      );

      if (existingCategory) {
        return null;
      }

      const createdCategory = await this.categoryRepository.create(category);

      return createdCategory;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error creating category");
    }
  }

  async deleteCategory(id: string) {
    try {
      return await this.categoryRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error deleting category");
    }
  }

  async getAllCategories() {
    try {
      const categories = await this.categoryRepository.findAll();

      if (categories.length === 0) {
        return null;
      }

      return categories;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }

      throw new Error("Error getting all categories");
    }
  }
}

export default new CategoryService();
