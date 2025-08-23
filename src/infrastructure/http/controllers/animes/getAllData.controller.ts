import { Request, Response } from "express";
import GetAllDataAnimeUseCase from "@/application/use-cases/animes/getAllData.use-case";
import AnimeRepository from "@/infrastructure/database/repositories/anime.repositories";
import ApiResponse from "../../utils/api.response";

class GetAllDataAnimeController {
  private getAllDataAnimeUseCase: GetAllDataAnimeUseCase;

  constructor() {
    const animeRepository = new AnimeRepository();
    this.getAllDataAnimeUseCase = new GetAllDataAnimeUseCase(animeRepository);
  }

  handle = async (req: Request, res: Response) => {
    try {
      const result = await this.getAllDataAnimeUseCase.execute();

      if (!result.success) {
        res.status(result.statusCode).json(result);
        return;
      }

      res.status(result.statusCode).json(result);
    } catch (error) {
      const response = ApiResponse.error(500, "Erro interno do servidor", null);

      res.status(response.statusCode).json(response);
    }
  };
}

export default GetAllDataAnimeController;
