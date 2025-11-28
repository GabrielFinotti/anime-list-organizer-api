import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { AnimeOutputDTO } from '../../dtos/anime.dto.js';
import AnimeMapper from '../../mappers/anime.mapper.js';

export class GetAllAnimesUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(): Promise<AnimeOutputDTO[]> {
    const animes = await this.animeRepository.findAll();

    return animes.map(AnimeMapper.toResponse);
  }
}

export default GetAllAnimesUseCase;
