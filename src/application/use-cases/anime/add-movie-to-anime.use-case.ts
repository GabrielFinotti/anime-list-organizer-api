import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { AnimeOutputDTO, AddMovieInputDTO } from '../../dtos/anime.dto.js';
import AnimeMapper from '../../mappers/anime.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class AddMovieToAnimeUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(input: AddMovieInputDTO): Promise<AnimeOutputDTO> {
    const anime = await this.animeRepository.findById(input.animeId);

    if (!anime) {
      throw new NotFoundError('Anime', input.animeId);
    }

    anime.addMovie({
      name: input.name,
      releaseDate: input.releaseDate,
    });

    const updatedAnime = await this.animeRepository.update(anime);

    return AnimeMapper.toResponse(updatedAnime);
  }
}

export default AddMovieToAnimeUseCase;
