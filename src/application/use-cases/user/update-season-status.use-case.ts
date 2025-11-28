import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import Season from '../../../domain/value-objects/season.value-object.js';
import SeasonStatus from '../../../domain/value-objects/seasonStatus.value-object.js';
import { UserOutputDTO, UpdateSeasonStatusInputDTO } from '../../dtos/user.dto.js';
import UserMapper from '../../mappers/user.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class UpdateSeasonStatusUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly animeRepository: IAnimeRepository,
  ) {}

  async execute(input: UpdateSeasonStatusInputDTO): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new NotFoundError('User', input.userId);
    }

    const anime = await this.animeRepository.findById(input.animeId);

    if (!anime) {
      throw new NotFoundError('Anime', input.animeId);
    }

    const season = Season.create({
      seasonNumber: input.season.seasonNumber,
      releaseDate: input.season.releaseDate,
      totalEpisodes: input.season.totalEpisodes,
    });

    const seasonStatus = SeasonStatus.create({
      season,
      status: input.status,
      lastEpisodeWatched: input.lastEpisodeWatched,
      isLiked: input.isLiked,
    });

    user.updateSeasonStatus(anime, seasonStatus);

    const updatedUser = await this.userRepository.update(user);

    return UserMapper.toResponse(updatedUser);
  }
}

export default UpdateSeasonStatusUseCase;
