import { Request, Response } from "express";
import UpdateAnimeUseCase from "@/application/use-cases/animes/update.use-case";
import AnimeRepository from "@/infrastructure/database/repositories/anime.repositories";
import ApiResponse from "../../utils/api.response";

class UpdateAnimeController {
  private updateAnimeUseCase: UpdateAnimeUseCase;

  constructor() {
    const animeRepository = new AnimeRepository();
    this.updateAnimeUseCase = new UpdateAnimeUseCase(animeRepository);
  }

  handle = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const result = await this.updateAnimeUseCase.execute(id, req.body);

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

export default UpdateAnimeController;
