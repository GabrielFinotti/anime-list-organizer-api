import { IAnimeRepository } from "@/domain/anime/repositories/anime.repository";
import ApiResponse from "@/infrastructure/http/utils/api.response";

class GetAllDataAnimeUseCase {
  constructor(private animeRepository: IAnimeRepository) {}

  async execute() {
    try {
      const animes = await this.animeRepository.findAll();

      if (animes.length === 0) {
        return ApiResponse.success(200, "Nenhum anime encontrado", []);
      }

      return ApiResponse.success(200, "Animes encontrados com sucesso", animes);
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Ocorreu um erro no processo de busca de todos os animes: ${error.message}`
          : `Ocorreu um erro desconhecido no processo de busca de todos os animes: ${error}`
      );

      throw error;
    }
  }
}

export default GetAllDataAnimeUseCase;
