import User from '../../domain/entities/User.entity.js';
import { UserOutputDTO } from '../dtos/user.dto.js';

class UserMapper {
  static toResponse(user: User): UserOutputDTO {
    return {
      id: user.id.value,
      imageUrl: user.imageUrl.value,
      username: user.username.value,
      email: user.email.value,
      biography: user.biography.value,
      animeList: {
        list: user.animeList.list.map((animeStatus) => ({
          animeId: animeStatus.anime.id.value,
          animeName: animeStatus.anime.name.value,
          status: animeStatus.status,
          moviesStatus: animeStatus.moviesStatus.map((movieStatus) => ({
            movie: {
              title: movieStatus.movie.title.value,
              releaseDate: movieStatus.movie.releaseDate,
            },
            status: movieStatus.status,
            isLiked: movieStatus.isLiked,
          })),
          seasonsStatus: animeStatus.seasonsStatus.map((seasonStatus) => ({
            season: {
              seasonNumber: seasonStatus.season.seasonNumber,
              releaseDate: seasonStatus.season.releaseDate,
              totalEpisodes: seasonStatus.season.totalEpisodes,
            },
            status: seasonStatus.status,
            lastEpisodeWatched: seasonStatus.lastEpisodeWatched,
            isLiked: seasonStatus.isLiked,
          })),
          isLiked: animeStatus.isLiked,
        })),
        updatedAt: user.animeList.updatedAt,
      },
      favoriteAnimes: user.favoriteAnimes.map((anime) => ({
        id: anime.id.value,
        name: anime.name.value,
        imageUrl: anime.imageUrl.value,
      })),
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default UserMapper;
