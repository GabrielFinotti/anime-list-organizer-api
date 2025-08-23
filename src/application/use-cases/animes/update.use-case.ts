import { UpdateAnimeDto } from "@/application/dtos/anime.dto";
import { IAnimeRepository } from "@/domain/anime/repositories/anime.repository";
import { updateAnimeSchema } from "@/domain/anime/schema/anime.schema";
import ApiResponse from "@/infrastructure/http/utils/api.response";

class UpdateAnimeUseCase {
  constructor(private animeRepository: IAnimeRepository) {}

  async execute(id: string, data: UpdateAnimeDto) {
    try {
      if (Object.keys(data).length === 0) {
        return ApiResponse.error(400, "Nenhum dado para atualizar", null);
      }

      const dataParsed = await updateAnimeSchema.safeParseAsync(data);

      if (!dataParsed.success) {
        return ApiResponse.error(
          400,
          "Dados Inválidos",
          dataParsed.error.format()
        );
      }

      const filteredData = Object.fromEntries(
        Object.entries(dataParsed.data).filter(([_, v]) => v !== undefined)
      );

      const updatedAnime = await this.animeRepository.update(id, filteredData);

      if (!updatedAnime) {
        return ApiResponse.error(404, "Anime não encontrado", null);
      }

      return ApiResponse.success(
        200,
        "Anime atualizado com sucesso",
        updatedAnime
      );
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Ocorreu um erro no processo de atualização do anime: ${error.message}`
          : `Ocorreu um erro desconhecido no processo de atualização do anime: ${error}`
      );

      throw error;
    }
  }
}

export default UpdateAnimeUseCase;
