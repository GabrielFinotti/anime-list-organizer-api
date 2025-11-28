import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { AnimeOutputDTO } from '../../dtos/anime.dto.js';
import AnimeMapper from '../../mappers/anime.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class GetAnimeByIdUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(id: string): Promise<AnimeOutputDTO> {
    const anime = await this.animeRepository.findById(id);

    if (!anime) {
      throw new NotFoundError('Anime', id);
    }

    return AnimeMapper.toResponse(anime);
  }
}

export default GetAnimeByIdUseCase;
