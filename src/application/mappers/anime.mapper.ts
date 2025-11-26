import Anime from '../../domain/entities/Anime.entity.js';
import Category from '../../domain/entities/Category.entity.js';
import Genre from '../../domain/entities/Genre.entity.js';
import Movie from '../../domain/value-objects/movie.value-object.js';
import Season from '../../domain/value-objects/season.value-object.js';
import { AnimeOutputDTO } from '../dtos/anime.dto.js';

type MovieDocument = {
  title: string;
  releaseDate: Date;
};

type SeasonDocument = {
  seasonNumber: number;
  releaseDate: Date;
  totalEpisodes: number;
};

type AnimeDocument = {
  _id: string;
  imageUrl: string;
  name: string;
  synopsis: string;
  category: string;
  genres: string[];
  animeType: 'serie' | 'movie' | 'mixed';
  productionType: 'original' | 'adaptation';
  movies: MovieDocument[];
  seasons: SeasonDocument[];
  isAdultContent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class AnimeMapper {
  static toPersistence(anime: Anime) {
    return {
      _id: anime.id.value,
      imageUrl: anime.imageUrl.value,
      name: anime.name.value,
      synopsis: anime.synopsis.value,
      category: anime.category.id.value,
      genres: anime.genres.map((genre) => genre.id.value),
      animeType: anime.animeType,
      productionType: anime.productionType,
      movies: anime.movies.map((movie) => ({
        title: movie.title.value,
        releaseDate: movie.releaseDate,
      })),
      seasons: anime.seasons.map((season) => ({
        seasonNumber: season.seasonNumber,
        releaseDate: season.releaseDate,
        totalEpisodes: season.totalEpisodes,
      })),
      isAdultContent: anime.isAdultContent,
      createdAt: anime.createdAt,
      updatedAt: anime.updatedAt,
    };
  }

  static toDomain(doc: AnimeDocument, category: Category, genres: Genre[]) {
    const movies = doc.movies.map((movie) =>
      Movie.create({
        name: movie.title,
        releaseDate: movie.releaseDate,
      }),
    );

    const seasons = doc.seasons.map((season) =>
      Season.create({
        seasonNumber: season.seasonNumber,
        releaseDate: season.releaseDate,
        totalEpisodes: season.totalEpisodes,
      }),
    );

    return Anime.toDomain({
      id: doc._id,
      imageUrl: doc.imageUrl,
      name: doc.name,
      synopsis: doc.synopsis,
      category,
      genres,
      animeType: doc.animeType,
      productionType: doc.productionType,
      movies,
      seasons,
      isAdultContent: doc.isAdultContent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toResponse(anime: Anime): AnimeOutputDTO {
    return {
      id: anime.id.value,
      imageUrl: anime.imageUrl.value,
      name: anime.name.value,
      synopsis: anime.synopsis.value,
      category: {
        id: anime.category.id.value,
        name: anime.category.name.value,
      },
      genres: anime.genres.map((genre) => ({
        id: genre.id.value,
        name: genre.name.value,
      })),
      animeType: anime.animeType,
      productionType: anime.productionType,
      movies: anime.movies.map((movie) => ({
        title: movie.title.value,
        releaseDate: movie.releaseDate,
      })),
      seasons: anime.seasons.map((season) => ({
        seasonNumber: season.seasonNumber,
        releaseDate: season.releaseDate,
        totalEpisodes: season.totalEpisodes,
      })),
      isAdultContent: anime.isAdultContent,
      createdAt: anime.createdAt,
      updatedAt: anime.updatedAt,
    };
  }
}

export default AnimeMapper;
