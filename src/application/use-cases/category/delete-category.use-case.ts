import { ICategoryRepository } from '../../../domain/repositories/category.repository.js';
import { NotFoundError } from '../../errors/index.js';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError('Category', id);
    }

    await this.categoryRepository.delete(id);
  }
}

export default DeleteCategoryUseCase;
