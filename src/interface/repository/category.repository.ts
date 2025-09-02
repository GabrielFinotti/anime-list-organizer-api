import { CategoryDTO } from "../dto/category.dto";

export type ICategoryRepository = {
  create(category: CategoryDTO): Promise<CategoryDTO>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<CategoryDTO>;
  findAll(): Promise<CategoryDTO[]>;
};
