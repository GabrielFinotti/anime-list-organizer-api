import { IAnimeRepository } from "../../../domain/repository/anime.js";

class DeleteAnimeUseCase {
  constructor(private readonly animeRepository: IAnimeRepository) {}

  async execute(id: string) {
    const anime = await this.animeRepository.findById(id);

    if (!anime) {
      throw new Error("Anime not found");
    }

    await this.animeRepository.delete(id);
  }
}

export default DeleteAnimeUseCase;
