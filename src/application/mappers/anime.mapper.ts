import Anime from '../../domain/entities/Anime.entity.js';
import { AnimeOutputDTO } from '../dtos/anime.dto.js';

class AnimeMapper {
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
      typeOfMaterialOrigin: anime.typeOfMaterialOrigin,
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
