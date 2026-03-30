import { ICategoryRepository } from "../../../domain/repository/category.js";
import CategoryApplicationMapper from "../../mapper/category.js";

class GetCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return CategoryApplicationMapper.toResponse(category);
  }
}

export default GetCategoryUseCase;
