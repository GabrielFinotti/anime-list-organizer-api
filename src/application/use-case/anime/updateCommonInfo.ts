import { IAnimeRepository } from "../../../domain/repository/anime.js";
import { ICategoryRepository } from "../../../domain/repository/category.js";
import { IGenreRepository } from "../../../domain/repository/genre.js";
import { UpdateAnimeCommonInfoDTO } from "../../dto/anime.js";
import AnimeApplicationMapper from "../../mapper/anime.js";

class UpdateAnimeCommonInfoUseCase {
  constructor(
    private readonly animeRepository: IAnimeRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly genreRepository: IGenreRepository
  ) {}

  async execute(id: string, input: UpdateAnimeCommonInfoDTO) {
    const anime = await this.animeRepository.findById(id);

    if (!anime) {
      throw new Error("Anime not found");
    }

    let category = anime.category;
    let genres = anime.genres;

    if (input.categoryId) {
      const foundCategory = await this.categoryRepository.findById(input.categoryId);

      if (!foundCategory) {
        throw new Error("Category not found");
      }

      category = foundCategory;
    }

    if (input.genreIds) {
      const foundGenres = await Promise.all(
        input.genreIds.map((genreId) => this.genreRepository.findById(genreId))
      );

      if (foundGenres.some((genre) => !genre)) {
        throw new Error("One or more genres not found");
      }

      genres = foundGenres.filter((g) => g !== null);
    }

    anime.updateCommonInfo({
      title: input.title,
      synopsis: input.synopsis,
      coverUrl: input.coverUrl,
      releaseDate: input.releaseDate,
      category: category,
      genres: genres,
      typeOfAnime: input.typeOfAnime,
      typeOfProduction: input.typeOfProduction,
      typeOfSourceMaterial: input.typeOfSourceMaterial,
      isAdultContent: input.isAdultContent,
    });

    const updatedAnime = await this.animeRepository.update(anime);

    return AnimeApplicationMapper.toResponse(updatedAnime);
  }
}

export default UpdateAnimeCommonInfoUseCase;
