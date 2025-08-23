import { IAnimeRepository } from "@/domain/anime/repositories/anime.repository";
import ApiResponse from "@/infrastructure/http/utils/api.response";

class DeleteAnimeUseCase {
  constructor(private animeRepository: IAnimeRepository) {}

  async execute(id: string) {
    try {
      const deleted = await this.animeRepository.delete(id);

      if (!deleted) {
        return ApiResponse.error(404, "Anime não encontrado", null);
      }

      return ApiResponse.success(200, "Anime removido com sucesso", null);
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Ocorreu um erro no processo de remoção do anime: ${error.message}`
          : `Ocorreu um erro desconhecido no processo de remoção do anime: ${error}`
      );

      throw error;
    }
  }
}

export default DeleteAnimeUseCase;
