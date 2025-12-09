import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { UserOutputDTO, UpdateAnimeStatusInputDTO } from '../../dtos/user.dto.js';
import UserMapper from '../../mappers/user.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class UpdateAnimeStatusUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly animeRepository: IAnimeRepository,
  ) {}

  async execute(input: UpdateAnimeStatusInputDTO): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new NotFoundError('User', input.userId);
    }

    const anime = await this.animeRepository.findById(input.animeId);

    if (!anime) {
      throw new NotFoundError('Anime', input.animeId);
    }

    user.updateAnimeStatus(anime, input.status);

    const updatedUser = await this.userRepository.update(user);

    return UserMapper.toResponse(updatedUser);
  }
}

export default UpdateAnimeStatusUseCase;
