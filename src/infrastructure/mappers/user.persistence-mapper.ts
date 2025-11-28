import Anime from '../../domain/entities/Anime.entity.js';
import User from '../../domain/entities/User.entity.js';
import AnimeStatus from '../../domain/value-objects/animeStatus.js';
import Movie from '../../domain/value-objects/movie.value-object.js';
import MovieStatus from '../../domain/value-objects/movieStatus.value-object.js';
import Season from '../../domain/value-objects/season.value-object.js';
import SeasonStatus from '../../domain/value-objects/seasonStatus.value-object.js';

export type MovieDocument = {
  title: string;
  releaseDate: Date;
};

export type SeasonDocument = {
  seasonNumber: number;
  releaseDate: Date;
  totalEpisodes: number;
};

export type MovieStatusDocument = {
  movie: MovieDocument;
  status: 'watching' | 'finished' | 'in_list';
  isLiked: boolean;
};

export type SeasonStatusDocument = {
  season: SeasonDocument;
  status: 'watching' | 'finished' | 'in_list';
  lastEpisodeWatched: number;
  isLiked: boolean;
};

export type AnimeStatusDocument = {
  anime: string;
  status: 'watching' | 'finished' | 'in_list' | 'dropped';
  moviesStatus: MovieStatusDocument[];
  seasonsStatus: SeasonStatusDocument[];
  isLiked: boolean;
};

export type UserDocument = {
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
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
};

export type UserPersistenceData = {
  _id: string;
  imageUrl: string;
  username: string;
  email: string;
  password: string;
  biography: string;
  animeList: {
    list: {
      anime: string;
      status: 'watching' | 'finished' | 'in_list' | 'dropped';
      moviesStatus: {
        movie: MovieDocument;
        status: 'watching' | 'finished' | 'in_list';
        isLiked: boolean;
      }[];
      seasonsStatus: {
        season: SeasonDocument;
        status: 'watching' | 'finished' | 'in_list';
        lastEpisodeWatched: number;
        isLiked: boolean;
      }[];
      isLiked: boolean;
    }[];
    updatedAt: Date;
  };
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
};

class UserPersistenceMapper {
  static toDomain(
    doc: UserDocument,
    animesMap: Map<string, Anime>,
  ): User {
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
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(user: User): UserPersistenceData {
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
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default UserPersistenceMapper;
