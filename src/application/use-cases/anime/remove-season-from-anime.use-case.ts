import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { AnimeOutputDTO, RemoveSeasonInputDTO } from '../../dtos/anime.dto.js';
import AnimeMapper from '../../mappers/anime.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class RemoveSeasonFromAnimeUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(input: RemoveSeasonInputDTO): Promise<AnimeOutputDTO> {
    const anime = await this.animeRepository.findById(input.animeId);

    if (!anime) {
      throw new NotFoundError('Anime', input.animeId);
    }

    anime.removeSeason({
      seasonNumber: input.seasonNumber,
      releaseDate: input.releaseDate,
      totalEpisodes: input.totalEpisodes,
    });

    const updatedAnime = await this.animeRepository.update(anime);

    return AnimeMapper.toResponse(updatedAnime);
  }
}

export default RemoveSeasonFromAnimeUseCase;
