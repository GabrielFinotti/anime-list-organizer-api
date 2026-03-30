import { IAnimeRepository } from "../../../domain/repository/anime.js";
import AnimeApplicationMapper from "../../mapper/anime.js";

class GetAnimeUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(id: string) {
    const anime = await this.animeRepository.findById(id);

    if (!anime) {
      throw new Error("Anime not found");
    }

    return AnimeApplicationMapper.toResponse(anime);
  }
}

export default GetAnimeUseCase;
