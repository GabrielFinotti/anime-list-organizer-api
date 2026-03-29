import { IAnimeRepository } from "../../../domain/repository/anime.js";
import { UpdateAnimeMoviesDTO } from "../../dto/anime.js";
import AnimeApplicationMapper from "../../mapper/anime.js";

class UpdateAnimeMoviesUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(id: string, input: UpdateAnimeMoviesDTO) {
    const anime = await this.animeRepository.findById(id);

    if (!anime) {
      throw new Error("Anime not found");
    }

    anime.updateMovies(input.movies);

    const updatedAnime = await this.animeRepository.update(anime);

    return AnimeApplicationMapper.toResponse(updatedAnime);
  }
}

export default UpdateAnimeMoviesUseCase;
