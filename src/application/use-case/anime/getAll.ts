import { IAnimeRepository } from "../../../domain/repository/anime.js";
import AnimeApplicationMapper from "../../mapper/anime.js";

class GetAllAnimesUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute() {
    const animes = await this.animeRepository.findAll();

    return animes.map(AnimeApplicationMapper.toResponse);
  }
}

export default GetAllAnimesUseCase;
