import { ICategoryRepository } from "../../../domain/repository/category.js";
import CategoryApplicationMapper from "../../mapper/category.js";

class GetAllCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute() {
    const categories = await this.categoryRepository.findAll();

    return categories.map(CategoryApplicationMapper.toResponse);
  }
}

export default GetAllCategoriesUseCase;