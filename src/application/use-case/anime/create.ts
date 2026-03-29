import Anime from "../../../domain/entity/Anime.js";
import { IAnimeRepository } from "../../../domain/repository/anime.js";
import { ICategoryRepository } from "../../../domain/repository/category.js";
import { IGenreRepository } from "../../../domain/repository/genre.js";
import { AnimeInputDTO } from "../../dto/anime.js";
import AnimeApplicationMapper from "../../mapper/anime.js";

class CreateAnimeUseCase {
  constructor(
    private readonly animeRepository: IAnimeRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly genreRepository: IGenreRepository
  ) {}

  async execute(input: AnimeInputDTO) {
    const existingAnime = await this.animeRepository.findByTitle(input.title);

    if (existingAnime) {
      throw new Error("Anime already exists");
    }

    const category = await this.categoryRepository.findById(input.category[0]);

    if (!category) {
      throw new Error("Category not found");
    }

    const genres = await Promise.all(
      input.genre.map((genreId) => this.genreRepository.findById(genreId))
    );

    if (genres.some((genre) => !genre)) {
      throw new Error("One or more genres not found");
    }

    const anime = Anime.create({
      title: input.title,
      synopsis: input.synopsis,
      coverUrl: input.coverUrl,
      releaseDate: input.releaseDate.toISOString().split("T")[0],
      category: category,
      genres: genres.filter((g) => g !== null),
      typeOfAnime: input.typeOfAnime,
      typeOfProduction: input.typeOfProduction,
      typeOfSourceMaterial: input.typeOfSourceMaterial,
      isAdultContent: input.isAdultContent,
      totalSeasons: input.totalSeasons,
      totalEpisodes: input.totalEpisodes,
      movies: input.movies,
    });

    await this.animeRepository.create(anime);

    return AnimeApplicationMapper.toResponse(anime);
  }
}

export default CreateAnimeUseCase;
