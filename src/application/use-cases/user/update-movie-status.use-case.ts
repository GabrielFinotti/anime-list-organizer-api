import { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { IAnimeRepository } from '../../../domain/repositories/anime.repository.js';
import Movie from '../../../domain/value-objects/movie.value-object.js';
import MovieStatus from '../../../domain/value-objects/movieStatus.value-object.js';
import { UserOutputDTO, UpdateMovieStatusInputDTO } from '../../dtos/user.dto.js';
import UserMapper from '../../mappers/user.mapper.js';
import { NotFoundError } from '../../errors/index.js';

export class UpdateMovieStatusUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly animeRepository: IAnimeRepository,
  ) {}

  async execute(input: UpdateMovieStatusInputDTO): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new NotFoundError('User', input.userId);
    }

    const anime = await this.animeRepository.findById(input.animeId);

    if (!anime) {
      throw new NotFoundError('Anime', input.animeId);
    }

    const movie = Movie.create({
      name: input.movie.name,
      releaseDate: input.movie.releaseDate,
    });

    const movieStatus = MovieStatus.create({
      movie,
      status: input.status,
      isLiked: input.isLiked,
    });

    user.updateMovieStatus(anime, movieStatus);

    const updatedUser = await this.userRepository.update(user);

    return UserMapper.toResponse(updatedUser);
  }
}

export default UpdateMovieStatusUseCase;
