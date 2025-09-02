import CategoryModel from "@/database/model/category.model";
import { CategoryDTO } from "@/interface/dto/category.dto";
import { ICategoryRepository } from "@/interface/repository/category.repository";

class CategoryRepository implements ICategoryRepository {
  async create(category: CategoryDTO) {
    try {
      const newCategory = await CategoryModel.create(category);

      const createdCategory: CategoryDTO = {
        ...newCategory,
        id: newCategory._id.toString(),
      };

      return createdCategory;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating category: ${error.message}`);
      }

      throw new Error("Error creating category");
    }
  }

  async delete(id: string) {
    try {
      const deleted = await CategoryModel.findByIdAndDelete(id);

      return !!deleted;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting category: ${error.message}`);
      }

      throw new Error("Error deleting category");
    }
  }

  async findByName(name: string) {
    try {
      const category = await CategoryModel.findOne({ name });

      if (!category) throw new Error("Category not found");

      const formatedCategory: CategoryDTO = {
        ...category,
        id: category._id.toString(),
      };

      return formatedCategory;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding category by name: ${error.message}`);
      }

      throw new Error("Error finding category by name");
    }
  }

  async findAll() {
    try {
      const categories = await CategoryModel.find();

      const formatedCategories: CategoryDTO[] = categories.map((category) => ({
        ...category,
        id: category._id.toString(),
      }));

      return formatedCategories;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error finding all categories: ${error.message}`);
      }

      throw new Error("Error finding all categories");
    }
  }
}

export default CategoryRepository;
