import Anime from "../../domain/entity/Anime.js";
import Category from "../../domain/entity/Category.js";
import Genre from "../../domain/entity/Genre.js";

export type AnimeDocument = {
  _id: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  releaseDate: Date;
  category: string;
  genres: string[];
  typeOfAnime: string;
  typeOfProduction: string;
  typeOfSourceMaterial: string;
  isAdultContent: boolean;
  totalSeasons: number;
  totalEpisodes: number;
  movies: {
    list: string[];
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

class AnimePersistenceMapper {
  static toDomain(doc: AnimeDocument, category: Category, genres: Genre[]) {
    return Anime.fromPersistence({ ...doc, category, genres });
  }

  static toPersistence(anime: Anime) {
    return {
      _id: anime.id.value,
      title: anime.title.value,
      synopsis: anime.synopsis.value,
      coverUrl: anime.coverUrl.value,
      releaseDate: anime.releaseDate,
      category: anime.category.id.value,
      genres: anime.genres.map((genre) => genre.id.value),
      typeOfAnime: anime.typeOfAnime,
      typeOfProduction: anime.typeOfProduction,
      typeOfSourceMaterial: anime.typeOfSourceMaterial,
      isAdultContent: anime.isAdultContent,
      totalSeasons: anime.totalSeasons,
      totalEpisodes: anime.totalEpisodes,
      movies: {
        list: anime.movies.list.map((movie) => movie.value),
        updatedAt: anime.movies.updatedAt,
      },
      createdAt: anime.createdAt,
      updatedAt: anime.updatedAt,
    };
  }
}

export default AnimePersistenceMapper;
