import { CategoryDTO } from "@/interface/dto/category.dto";
import CategoryService from "@/service/category.service";
import { Request, Response } from "express";

class CategoryController {
  private constructor(private categoryService = new CategoryService()) {}

  static async create(req: Request, res: Response) {
    try {
      const body = req.body as CategoryDTO;

      const data =
        await new CategoryController().categoryService.createCategory(body);

      if (!data) {
        return res.status(409).json({ message: "Category already exists" });
      }

      return res.status(201).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error creating category" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.categoryId;

      const data =
        await new CategoryController().categoryService.deleteCategory(id);

      if (!data) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error deleting category" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const data =
        await new CategoryController().categoryService.getAllCategories();

      if (!data) {
        return res.status(404).json({ message: "No categories found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Error getting all categories" });
    }
  }
}

export default CategoryController;
