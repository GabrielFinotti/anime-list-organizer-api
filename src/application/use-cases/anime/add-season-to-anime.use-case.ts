import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { AnimeOutputDTO, AddSeasonInputDTO } from '../../dtos/anime.dto.js';
import AnimeMapper from '../../mappers/anime.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class AddSeasonToAnimeUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(input: AddSeasonInputDTO): Promise<AnimeOutputDTO> {
    const anime = await this.animeRepository.findById(input.animeId);

    if (!anime) {
      throw new NotFoundError('Anime', input.animeId);
    }

    anime.addSeason({
      seasonNumber: input.seasonNumber,
      releaseDate: input.releaseDate,
      totalEpisodes: input.totalEpisodes,
    });

    const updatedAnime = await this.animeRepository.update(anime);

    return AnimeMapper.toResponse(updatedAnime);
  }
}

export default AddSeasonToAnimeUseCase;
