import Anime from "../../domain/entity/Anime.js";

class AnimeApplicationMapper {
  static toResponse(anime: Anime) {
    return {
      id: anime.id.value,
      title: anime.title.value,
      synopsis: anime.synopsis.value,
      coverUrl: anime.coverUrl.value,
      releaseDate: anime.releaseDate,
      category: {
        id: anime.category.id.value,
        name: anime.category.name.value,
      },
      genres: {
        id: anime.genres.map((genre) => genre.id.value),
        name: anime.genres.map((genre) => genre.name.value),
      },
      typeOfAnime: anime.typeOfAnime,
      typeOfProduction: anime.typeOfProduction,
      typeOfSourceMaterial: anime.typeOfSourceMaterial,
      isAdultContent: anime.isAdultContent,
      totalSeasons: anime.totalSeasons,
      totalEpisodes: anime.totalEpisodes,
      movies: anime.movies,
      createdAt: anime.createdAt,
      updatedAt: anime.updatedAt,
    };
  }
}

export default AnimeApplicationMapper;
