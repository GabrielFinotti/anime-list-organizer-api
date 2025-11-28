import { IGenreRepository } from '../../../domain/repositories/genre.repository.js';
import { GenreOutputDTO } from '../../dtos/genre.dto.js';
import GenreMapper from '../../mappers/genre.mapper.js';

export class GetAllGenresUseCase {
  constructor(private readonly genreRepository: IGenreRepository) {}

  async execute(): Promise<GenreOutputDTO[]> {
    const genres = await this.genreRepository.findAll();

    return genres.map(GenreMapper.toResponse);
  }
}

export default GetAllGenresUseCase;
