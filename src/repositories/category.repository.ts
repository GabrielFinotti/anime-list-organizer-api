import CategoryModel from "@/database/model/category.model";
import { CategoryDTO } from "@/interface/dto/category.dto";
import { ICategoryRepository } from "@/interface/repository/category.repository";

class CategoryRepository implements ICategoryRepository {
  async create(category: CategoryDTO) {
    try {
      const newCategory = await CategoryModel.create(category);

      const createdCategory: CategoryDTO = {
        id: newCategory._id.toString(),
        ...newCategory,
      };

      return createdCategory;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating category: ${error.message}`);
      }

      throw new Error("Unknown error creating category");
    }
  }
}

export default CategoryRepository;
