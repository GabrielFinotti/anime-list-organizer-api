import { IGenreRepository } from '../../../domain/repositories/genre.repository.js';
import Genre from '../../../domain/entities/Genre.entity.js';
import { GenreInputDTO, GenreOutputDTO } from '../../dtos/genre.dto.js';
import GenreMapper from '../../mappers/genre.mapper.js';
import { ConflictError } from '../../errors/index.js';

export class CreateGenreUseCase {
  constructor(private readonly genreRepository: IGenreRepository) {}

  async execute(input: GenreInputDTO): Promise<GenreOutputDTO> {
    const genre = Genre.create(input.name, input.description, input.isAdultContent);

    const existingGenre = await this.genreRepository.findByName(genre.name.value);

    if (existingGenre) {
      throw new ConflictError('Genre', 'name', genre.name.value);
    }

    await this.genreRepository.create(genre);

    return GenreMapper.toResponse(genre);
  }
}

export default CreateGenreUseCase;
