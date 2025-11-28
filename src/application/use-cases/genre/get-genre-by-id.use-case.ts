import { IGenreRepository } from '../../../domain/repositories/genre.repository.js';
import { GenreOutputDTO } from '../../dtos/genre.dto.js';
import GenreMapper from '../../mappers/genre.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class GetGenreByIdUseCase {
  constructor(private readonly genreRepository: IGenreRepository) {}

  async execute(id: string): Promise<GenreOutputDTO> {
    const genre = await this.genreRepository.findById(id);

    if (!genre) {
      throw new NotFoundError('Genre', id);
    }

    return GenreMapper.toResponse(genre);
  }
}

export default GetGenreByIdUseCase;
