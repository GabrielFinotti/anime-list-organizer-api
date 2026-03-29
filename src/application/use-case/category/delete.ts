import { ICategoryRepository } from "../../../domain/repository/category.js";

class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    await this.categoryRepository.delete(id);
  }
}

export default DeleteCategoryUseCase;
