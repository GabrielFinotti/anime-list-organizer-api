import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { IGenreRepository } from '../../../domain/repositories/genre.repository.js';
import { AnimeOutputDTO, AddGenreToAnimeInputDTO } from '../../dtos/anime.dto.js';
import AnimeMapper from '../../mappers/anime.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class AddGenreToAnimeUseCase {
  constructor(
    private readonly animeRepository: IAnimeRepository,
    private readonly genreRepository: IGenreRepository,
  ) {}

  async execute(input: AddGenreToAnimeInputDTO): Promise<AnimeOutputDTO> {
    const anime = await this.animeRepository.findById(input.animeId);

    if (!anime) {
      throw new NotFoundError('Anime', input.animeId);
    }

    const genres = await Promise.all(
      input.genreIds.map((genreId) => this.genreRepository.findById(genreId)),
    );

    const notFoundIndex = genres.findIndex((genre) => !genre);
    if (notFoundIndex !== -1) {
      throw new NotFoundError('Genre', input.genreIds[notFoundIndex]);
    }

    genres.forEach((genre) => {
      if (genre) {
        anime.addGenre(genre);
      }
    });

    const updatedAnime = await this.animeRepository.update(anime);

    return AnimeMapper.toResponse(updatedAnime);
  }
}

export default AddGenreToAnimeUseCase;
