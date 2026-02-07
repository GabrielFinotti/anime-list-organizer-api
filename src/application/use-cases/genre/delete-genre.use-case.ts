import { IGenreRepository } from '../../../domain/repositories/genre.repository.js';
import { NotFoundError } from '../../errors/index.js';

export class DeleteGenreUseCase {
  constructor(private readonly genreRepository: IGenreRepository) {}

  async execute(id: string): Promise<void> {
    const genre = await this.genreRepository.findById(id);

    if (!genre) {
      throw new NotFoundError('Genre', id);
    }

    await this.genreRepository.delete(id);
  }
}

export default DeleteGenreUseCase;
