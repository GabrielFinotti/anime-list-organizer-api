import Category from "../entity/Category.js";

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  create(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
}
