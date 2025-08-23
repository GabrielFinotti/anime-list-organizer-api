import { Request, Response } from "express";
import GetAnimeDataUseCase from "@/application/use-cases/animes/getAnimeData.use-case";
import AnimeRepository from "@/infrastructure/database/repositories/anime.repositories";
import ApiResponse from "../../utils/api.response";

class GetAnimeDataController {
  private getAnimeDataUseCase: GetAnimeDataUseCase;

  constructor() {
    const animeRepository = new AnimeRepository();
    this.getAnimeDataUseCase = new GetAnimeDataUseCase(animeRepository);
  }

  handle = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const result = await this.getAnimeDataUseCase.execute(id);

      if (!result.success) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.status(result.statusCode).json(result);
    } catch (error) {
      const result = ApiResponse.error(500, "Erro interno do servidor", null);

      res.status(result.statusCode).json(result);
    }
  };
}

export default GetAnimeDataController;
