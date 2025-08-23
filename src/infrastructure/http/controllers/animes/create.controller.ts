import { Request, Response } from "express";
import CreateAnimeUseCase from "@/application/use-cases/animes/create.use-case";
import AnimeRepository from "@/infrastructure/database/repositories/anime.repositories";
import ApiResponse from "../../utils/api.response";

class CreateAnimeController {
  private createAnimeUseCase: CreateAnimeUseCase;

  constructor() {
    const animeRepository = new AnimeRepository();
    this.createAnimeUseCase = new CreateAnimeUseCase(animeRepository);
  }

  handle = async (req: Request, res: Response) => {
    try {
      const result = await this.createAnimeUseCase.execute(req.body);

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

export default CreateAnimeController;
