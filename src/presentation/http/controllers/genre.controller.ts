import { Request, Response, NextFunction } from 'express';
import { CreateGenreUseCase } from '../../../application/use-cases/genre/create-genre.use-case.js';
import { GetGenreByIdUseCase } from '../../../application/use-cases/genre/get-genre-by-id.use-case.js';
import { GetAllGenresUseCase } from '../../../application/use-cases/genre/get-all-genres.use-case.js';
import { DeleteGenreUseCase } from '../../../application/use-cases/genre/delete-genre.use-case.js';
import { GenreInputDTO } from '../../../application/dtos/genre.dto.js';

export class GenreController {
  constructor(
    private readonly createGenreUseCase: CreateGenreUseCase,
    private readonly getGenreByIdUseCase: GetGenreByIdUseCase,
    private readonly getAllGenresUseCase: GetAllGenresUseCase,
    private readonly deleteGenreUseCase: DeleteGenreUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: GenreInputDTO = {
        name: req.body.name,
        description: req.body.description,
        isAdultContent: req.body.isAdultContent ?? false,
      };

      const genre = await this.createGenreUseCase.execute(input);

      res.status(201).json(genre);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const genre = await this.getGenreByIdUseCase.execute(id);

      res.status(200).json(genre);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const genres = await this.getAllGenresUseCase.execute();

      res.status(200).json(genres);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      await this.deleteGenreUseCase.execute(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default GenreController;
