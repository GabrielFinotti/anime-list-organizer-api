import AnimeLookupService from "@/infrastructure/api/openai/anime.lookup";
import ApiResponse from "@/infrastructure/http/utils/api.response";

class AnimeLookupUseCase {
  constructor(private animeLookupService = new AnimeLookupService()) {}

  async execute(title: string) {
    try {
      if (title.trim() === "" || title.length < 5) {
        return ApiResponse.error(400, "Título inválido", null);
      }

      const data = await this.animeLookupService.lookup(title);

      if (!data) {
        return ApiResponse.error(500, "Falha ao obter dados do anime", null);
      }

      return ApiResponse.success(200, "Consulta realizada", data);
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Ocorreu um erro ao tentar recuperar os dados do anime: ${error.message}`
          : `Ocorreu um erro desconhecido ao tentar recuperar os dados do anime: ${error}`
      );

      throw error;
    }
  }
}

export default AnimeLookupUseCase;
