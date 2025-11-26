import Anime from '../../domain/entities/Anime.entity.js';
import User from '../../domain/entities/User.entity.js';
import AnimeStatus from '../../domain/value-objects/animeStatus.js';
import Movie from '../../domain/value-objects/movie.value-object.js';
import MovieStatus from '../../domain/value-objects/movieStatus.value-object.js';
import Season from '../../domain/value-objects/season.value-object.js';
import SeasonStatus from '../../domain/value-objects/seasonStatus.value-object.js';
import { UserOutputDTO } from '../dtos/user.dto.js';

type MovieDocument = {
  title: string;
  releaseDate: Date;
};

type SeasonDocument = {
  seasonNumber: number;
  releaseDate: Date;
  totalEpisodes: number;
};

type MovieStatusDocument = {
  movie: MovieDocument;
  status: 'watching' | 'finished' | 'in_list';
  isLiked: boolean;
};

type SeasonStatusDocument = {
  season: SeasonDocument;
  status: 'watching' | 'finished' | 'in_list';
  lastEpisodeWatched: number;
  isLiked: boolean;
};

type AnimeStatusDocument = {
  anime: string;
  status: 'watching' | 'finished' | 'in_list' | 'dropped';
  moviesStatus: MovieStatusDocument[];
  seasonsStatus: SeasonStatusDocument[];
  isLiked: boolean;
};

type UserDocument = {
  _id: string;
  imageUrl: string;
  username: string;
  email: string;
  password: string;
  biography: string;
  animeList: {
    list: AnimeStatusDocument[];
    updatedAt: Date;
  };
  favoriteAnimes: {
    list: string[];
    updatedAt: Date;
  };
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
};

class UserMapper {
  static toPersistence(user: User) {
    return {
      _id: user.id.value,
      imageUrl: user.imageUrl.value,
      username: user.username.value,
      email: user.email.value,
      password: user.password.value,
      biography: user.biography.value,
      animeList: {
        list: user.animeList.list.map((animeStatus) => ({
          anime: animeStatus.anime.id.value,
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
      favoriteAnimes: {
        list: user.favoriteAnimes.list.map((anime) => anime.id.value),
        updatedAt: user.favoriteAnimes.updatedAt,
      },
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toDomain(
    doc: UserDocument,
    animesMap: Map<string, Anime>,
    favoriteAnimesMap: Map<string, Anime>,
  ) {
    const animeListDomain = doc.animeList.list.map((animeStatusDoc) => {
      const anime = animesMap.get(animeStatusDoc.anime);

      if (!anime) {
        throw new Error(`Anime not found: ${animeStatusDoc.anime}`);
      }

      const moviesStatus = animeStatusDoc.moviesStatus.map((ms) => {
        const movie = Movie.create({
          name: ms.movie.title,
          releaseDate: ms.movie.releaseDate,
        });

        return MovieStatus.create({
          movie,
          status: ms.status as 'watching' | 'finished' | 'in_list',
          isLiked: ms.isLiked,
        });
      });

      const seasonsStatus = animeStatusDoc.seasonsStatus.map((ss) => {
        const season = Season.create({
          seasonNumber: ss.season.seasonNumber,
          releaseDate: ss.season.releaseDate,
          totalEpisodes: ss.season.totalEpisodes,
        });

        return SeasonStatus.create({
          season,
          status: ss.status as 'watching' | 'finished' | 'in_list',
          lastEpisodeWatched: ss.lastEpisodeWatched,
          isLiked: ss.isLiked,
        });
      });

      return AnimeStatus.create({
        anime,
        status: animeStatusDoc.status,
        moviesStatus,
        seasonsStatus,
        isLiked: animeStatusDoc.isLiked,
      });
    });

    const favoriteAnimesDomain = doc.favoriteAnimes.list
      .map((animeId) => favoriteAnimesMap.get(animeId))
      .filter((anime): anime is Anime => anime !== undefined);

    return User.toDomain({
      id: doc._id,
      imageUrl: doc.imageUrl,
      username: doc.username,
      email: doc.email,
      password: doc.password,
      biography: doc.biography,
      animeList: {
        list: animeListDomain,
        updatedAt: doc.animeList.updatedAt,
      },
      favoriteAnimes: {
        list: favoriteAnimesDomain,
        updatedAt: doc.favoriteAnimes.updatedAt,
      },
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

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
      favoriteAnimes: {
        list: user.favoriteAnimes.list.map((anime) => ({
          id: anime.id.value,
          name: anime.name.value,
        })),
        updatedAt: user.favoriteAnimes.updatedAt,
      },
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default UserMapper;
