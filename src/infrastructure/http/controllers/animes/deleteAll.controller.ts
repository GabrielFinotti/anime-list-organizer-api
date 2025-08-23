import { Request, Response } from "express";
import DeleteAllAnimeUseCase from "@/application/use-cases/animes/deleteAll.use-case";
import AnimeRepository from "@/infrastructure/database/repositories/anime.repositories";
import ApiResponse from "../../utils/api.response";

class DeleteAllAnimeController {
  private deleteAllAnimeUseCase: DeleteAllAnimeUseCase;

  constructor() {
    const animeRepository = new AnimeRepository();
    this.deleteAllAnimeUseCase = new DeleteAllAnimeUseCase(animeRepository);
  }

  handle = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteAllAnimeUseCase.execute();

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

export default DeleteAllAnimeController;
