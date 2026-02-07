import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import { UserOutputDTO, RemoveAnimeFromListInputDTO } from '../../dtos/user.dto.js';
import UserMapper from '../../mappers/user.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class RemoveAnimeFromListUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly animeRepository: IAnimeRepository,
  ) {}

  async execute(input: RemoveAnimeFromListInputDTO): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new NotFoundError('User', input.userId);
    }

    const anime = await this.animeRepository.findById(input.animeId);

    if (!anime) {
      throw new NotFoundError('Anime', input.animeId);
    }

    user.removeAnimeFromAnimeList(anime);

    const updatedUser = await this.userRepository.update(user);

    return UserMapper.toResponse(updatedUser);
  }
}

export default RemoveAnimeFromListUseCase;
