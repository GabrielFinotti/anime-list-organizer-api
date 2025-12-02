import { Request, Response, NextFunction } from 'express';
import { CreateCategoryUseCase } from '../../../application/use-cases/category/create-category.use-case.js';
import { GetCategoryByIdUseCase } from '../../../application/use-cases/category/get-category-by-id.use-case.js';
import { GetAllCategoriesUseCase } from '../../../application/use-cases/category/get-all-categories.use-case.js';
import { DeleteCategoryUseCase } from '../../../application/use-cases/category/delete-category.use-case.js';
import { CategoryInputDTO } from '../../../application/dtos/category.dto.js';

export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CategoryInputDTO = {
        name: req.body.name,
        description: req.body.description,
      };

      const category = await this.createCategoryUseCase.execute(input);

      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const category = await this.getCategoryByIdUseCase.execute(id);

      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await this.getAllCategoriesUseCase.execute();

      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await this.deleteCategoryUseCase.execute(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default CategoryController;
