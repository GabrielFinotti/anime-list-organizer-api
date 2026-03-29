import Category from "../../../domain/entity/Category.js";
import { ICategoryRepository } from "../../../domain/repository/category.js";
import { CategoryInputDTO } from "../../dto/category.js";
import CategoryApplicationMapper from "../../mapper/category.js";

class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CategoryInputDTO) {
    const existingCategory = await this.categoryRepository.findByName(
      input.name,
    );
    
    if (existingCategory) {
      throw new Error("Category already exists");
    }

    const category = Category.create({
      name: input.name,
      description: input.description,
      targetAudience: input.targetAudience,
    });

    await this.categoryRepository.create(category);

    return CategoryApplicationMapper.toResponse(category);
  }
}

export default CreateCategoryUseCase;
