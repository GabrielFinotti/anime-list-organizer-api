import { IAnimeRepository } from "@/domain/anime/repositories/anime.repository";
import ApiResponse from "@/infrastructure/http/utils/api.response";

class DeleteAllAnimeUseCase {
  constructor(private animeRepository: IAnimeRepository) {}

  async execute() {
    try {
      await this.animeRepository.deleteAll();

      return ApiResponse.success(
        200,
        "Todos os animes removidos com sucesso",
        null
      );
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Ocorreu um erro no processo de remoção de todos os animes: ${error.message}`
          : `Ocorreu um erro desconhecido no processo de remoção de todos os animes: ${error}`
      );

      throw error;
    }
  }
}

export default DeleteAllAnimeUseCase;
