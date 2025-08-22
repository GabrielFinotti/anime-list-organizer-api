import { Request, Response } from "express";
import DeleteAnimeUseCase from "@/application/use-cases/animes/delete.use-case";
import AnimeRepository from "@/infrastructure/database/repositories/anime.repositories";
import ApiResponse from "../../utils/api.response";

class DeleteAnimeController {
  private deleteAnimeUseCase: DeleteAnimeUseCase;

  constructor() {
    const animeRepository = new AnimeRepository();
    this.deleteAnimeUseCase = new DeleteAnimeUseCase(animeRepository);
  }

  handle = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const result = await this.deleteAnimeUseCase.execute(id);

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

export default DeleteAnimeController;
