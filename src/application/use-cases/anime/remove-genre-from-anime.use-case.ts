import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import Id from '../../../domain/value-objects/id.value-object.js';
import { AnimeOutputDTO, RemoveGenreFromAnimeInputDTO } from '../../dtos/anime.dto.js';
import AnimeMapper from '../../mappers/anime.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class RemoveGenreFromAnimeUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(input: RemoveGenreFromAnimeInputDTO): Promise<AnimeOutputDTO> {
    const anime = await this.animeRepository.findById(input.animeId);

    if (!anime) {
      throw new NotFoundError('Anime', input.animeId);
    }

    const genreId = Id.create(input.genreId);

    anime.removeGenre(genreId);

    const updatedAnime = await this.animeRepository.update(anime);

    return AnimeMapper.toResponse(updatedAnime);
  }
}

export default RemoveGenreFromAnimeUseCase;
