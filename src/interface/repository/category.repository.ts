import { CategoryDTO } from "../dto/category.dto";

export type ICategoryRepository = {
  create(category: CategoryDTO): Promise<CategoryDTO>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<CategoryDTO | null>;
  findAll(): Promise<CategoryDTO[]>;
};
