import CategoryModel from "@/database/model/category.model";
import { CategoryDTO } from "@/interface/dto/category.dto";
import { ICategoryRepository } from "@/interface/repository/category.repository";

class CategoryRepository implements ICategoryRepository {
  async create(category: CategoryDTO) {
    try {
      const newCategory = await CategoryModel.create(category);

      const createdCategory: CategoryDTO = {
        id: newCategory._id.toString(),
        name: newCategory.name,
        translatedName: newCategory.translatedName,
        targetAudience: newCategory.targetAudience,
        characteristics: newCategory.characteristics,
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

      if (!category) return null;

      const formatedCategory: CategoryDTO = {
        id: category._id.toString(),
        name: category.name,
        translatedName: category.translatedName,
        targetAudience: category.targetAudience,
        characteristics: category.characteristics,
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
        id: category._id.toString(),
        name: category.name,
        translatedName: category.translatedName,
        targetAudience: category.targetAudience,
        characteristics: category.characteristics,
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
