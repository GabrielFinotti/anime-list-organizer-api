import { IAnimeRepository } from "../../../domain/repository/anime.js";
import { UpdateAnimeSeasonOrEpisodeInfoDTO } from "../../dto/anime.js";
import AnimeApplicationMapper from "../../mapper/anime.js";

class UpdateAnimeSeasonOrEpisodeInfoUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(id: string, input: UpdateAnimeSeasonOrEpisodeInfoDTO) {
    const anime = await this.animeRepository.findById(id);

    if (!anime) {
      throw new Error("Anime not found");
    }

    anime.updateSeasonOrEpisodeInfo(input);

    const updatedAnime = await this.animeRepository.update(anime);

    return AnimeApplicationMapper.toResponse(updatedAnime);
  }
}

export default UpdateAnimeSeasonOrEpisodeInfoUseCase;
