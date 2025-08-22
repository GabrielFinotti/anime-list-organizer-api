import { IAnimeRepository } from "@/domain/anime/repositories/anime.repository";
import ApiResponse from "@/infrastructure/http/utils/api.response";

class GetAnimeDataUseCase {
  constructor(private animeRepository: IAnimeRepository) {}

  async execute(id: string) {
    try {
      const anime = await this.animeRepository.findById(id);

      if (!anime) {
        return ApiResponse.error(404, "Anime não encontrado", null);
      }

      return ApiResponse.success(200, "Anime encontrado com sucesso", anime);
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Ocorreu um erro no processo de busca do anime: ${error.message}`
          : `Ocorreu um erro desconhecido no processo de busca do anime: ${error}`
      );

      throw error;
    }
  }
}

export default GetAnimeDataUseCase;
