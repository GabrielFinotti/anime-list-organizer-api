import { Request, Response, NextFunction } from 'express';
import { LookupAnimeUseCase } from '../../../application/use-cases/anime/lookup-anime.use-case.js';
import { CreateAnimeUseCase } from '../../../application/use-cases/anime/create-anime.use-case.js';
import { GetAnimeByIdUseCase } from '../../../application/use-cases/anime/get-anime-by-id.use-case.js';
import { GetAllAnimesUseCase } from '../../../application/use-cases/anime/get-all-animes.use-case.js';
import { UpdateAnimeUseCase } from '../../../application/use-cases/anime/update-anime.use-case.js';
import { DeleteAnimeUseCase } from '../../../application/use-cases/anime/delete-anime.use-case.js';
import { AddMovieToAnimeUseCase } from '../../../application/use-cases/anime/add-movie-to-anime.use-case.js';
import { AddSeasonToAnimeUseCase } from '../../../application/use-cases/anime/add-season-to-anime.use-case.js';
import { AddGenreToAnimeUseCase } from '../../../application/use-cases/anime/add-genre-to-anime.use-case.js';
import { RemoveMovieFromAnimeUseCase } from '../../../application/use-cases/anime/remove-movie-from-anime.use-case.js';
import { RemoveSeasonFromAnimeUseCase } from '../../../application/use-cases/anime/remove-season-from-anime.use-case.js';
import { RemoveGenreFromAnimeUseCase } from '../../../application/use-cases/anime/remove-genre-from-anime.use-case.js';
import {
  AnimeInputDTO,
  UpdateAnimeInputDTO,
  AddMovieInputDTO,
  AddSeasonInputDTO,
  AddGenreToAnimeInputDTO,
  RemoveMovieInputDTO,
  RemoveSeasonInputDTO,
  RemoveGenreFromAnimeInputDTO,
} from '../../../application/dtos/anime.dto.js';

export class AnimeController {
  constructor(
    private readonly lookupAnimeUseCase: LookupAnimeUseCase,
    private readonly createAnimeUseCase: CreateAnimeUseCase,
    private readonly getAnimeByIdUseCase: GetAnimeByIdUseCase,
    private readonly getAllAnimesUseCase: GetAllAnimesUseCase,
    private readonly updateAnimeUseCase: UpdateAnimeUseCase,
    private readonly deleteAnimeUseCase: DeleteAnimeUseCase,
    private readonly addMovieToAnimeUseCase: AddMovieToAnimeUseCase,
    private readonly addSeasonToAnimeUseCase: AddSeasonToAnimeUseCase,
    private readonly addGenreToAnimeUseCase: AddGenreToAnimeUseCase,
    private readonly removeMovieFromAnimeUseCase: RemoveMovieFromAnimeUseCase,
    private readonly removeSeasonFromAnimeUseCase: RemoveSeasonFromAnimeUseCase,
    private readonly removeGenreFromAnimeUseCase: RemoveGenreFromAnimeUseCase,
  ) {}

  lookupAnime = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const animeData = await this.lookupAnimeUseCase.execute(req.query.title as string);

      res.status(200).json(animeData);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: AnimeInputDTO = {
        imageUrl: req.body.imageUrl,
        name: req.body.name,
        synopsis: req.body.synopsis,
        categoryId: req.body.categoryId,
        genreIds: req.body.genreIds ?? [],
        animeType: req.body.animeType,
        productionType: req.body.productionType,
        typeOfMaterialOrigin: req.body.typeOfMaterialOrigin,
        movies: req.body.movies ?? [],
        seasons: req.body.seasons ?? [],
        isAdultContent: req.body.isAdultContent ?? false,
      };

      const anime = await this.createAnimeUseCase.execute(input);

      res.status(201).json(anime);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const anime = await this.getAnimeByIdUseCase.execute(id);

      res.status(200).json(anime);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const animes = await this.getAllAnimesUseCase.execute();

      res.status(200).json(animes);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const input: UpdateAnimeInputDTO = {
        id,
        name: req.body.name,
        synopsis: req.body.synopsis,
        categoryId: req.body.categoryId,
        animeType: req.body.animeType,
        productionType: req.body.productionType,
        typeOfMaterialOrigin: req.body.typeOfMaterialOrigin,
        isAdultContent: req.body.isAdultContent,
        imageUrl: req.body.imageUrl,
      };

      const anime = await this.updateAnimeUseCase.execute(input);

      res.status(200).json(anime);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      await this.deleteAnimeUseCase.execute(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  addMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const input: AddMovieInputDTO = {
        animeId: id,
        name: req.body.name,
        releaseDate: new Date(req.body.releaseDate),
      };

      const anime = await this.addMovieToAnimeUseCase.execute(input);

      res.status(200).json(anime);
    } catch (error) {
      next(error);
    }
  };

  addSeason = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const input: AddSeasonInputDTO = {
        animeId: id,
        seasonNumber: req.body.seasonNumber,
        releaseDate: new Date(req.body.releaseDate),
        totalEpisodes: req.body.totalEpisodes,
      };

      const anime = await this.addSeasonToAnimeUseCase.execute(input);

      res.status(200).json(anime);
    } catch (error) {
      next(error);
    }
  };

  addGenre = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const input: AddGenreToAnimeInputDTO = {
        animeId: id,
        genreId: req.body.genreId,
      };

      const anime = await this.addGenreToAnimeUseCase.execute(input);

      res.status(200).json(anime);
    } catch (error) {
      next(error);
    }
  };

  removeMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const input: RemoveMovieInputDTO = {
        animeId: id,
        name: req.body.name,
        releaseDate: new Date(req.body.releaseDate),
      };

      const anime = await this.removeMovieFromAnimeUseCase.execute(input);

      res.status(200).json(anime);
    } catch (error) {
      next(error);
    }
  };

  removeSeason = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const input: RemoveSeasonInputDTO = {
        animeId: id,
        seasonNumber: req.body.seasonNumber,
        releaseDate: new Date(req.body.releaseDate),
        totalEpisodes: req.body.totalEpisodes,
      };

      const anime = await this.removeSeasonFromAnimeUseCase.execute(input);

      res.status(200).json(anime);
    } catch (error) {
      next(error);
    }
  };

  removeGenre = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, genreId } = req.params;

      const input: RemoveGenreFromAnimeInputDTO = {
        animeId: id,
        genreId,
      };

      const anime = await this.removeGenreFromAnimeUseCase.execute(input);

      res.status(200).json(anime);
    } catch (error) {
      next(error);
    }
  };
}

export default AnimeController;
