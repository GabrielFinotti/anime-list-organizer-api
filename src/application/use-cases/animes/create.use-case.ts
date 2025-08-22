import { CreateAnimeDto } from "@/application/dtos/anime.dto";
import { IAnimeRepository } from "@/domain/anime/repositories/anime.repository";
import { createAnimeSchema } from "@/domain/anime/schema/anime.schema";
import ApiResponse from "@/infrastructure/http/utils/api.response";

class CreateAnimeUseCase {
  constructor(private animeRepository: IAnimeRepository) {}

  async execute(data: CreateAnimeDto) {
    try {
      const dataParsed = await createAnimeSchema.safeParseAsync(data);

      if (!dataParsed.success) {
        return ApiResponse.error(
          400,
          "Dados Inválidos",
          dataParsed.error.format()
        );
      }

      const existingAnime = await this.animeRepository.findByName(
        dataParsed.data.name
      );

      if (existingAnime) {
        return ApiResponse.error(409, "Anime já existe na lista", null);
      }

      const newAnime = await this.animeRepository.create(dataParsed.data);

      return ApiResponse.success(201, "Anime adicionado com sucesso", newAnime);
    } catch (error) {
      console.error(
        error instanceof Error
          ? `Ocorreu um erro no processo de criação do anime: ${error.message}`
          : `Ocorreu um erro desconhecido no processo de criação do anime: ${error}`
      );

      throw error;
    }
  }
}

export default CreateAnimeUseCase;
