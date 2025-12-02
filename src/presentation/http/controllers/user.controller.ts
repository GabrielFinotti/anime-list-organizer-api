import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/user/create-user.use-case.js';
import { GetUserByIdUseCase } from '../../../application/use-cases/user/get-user-by-id.use-case.js';
import { GetAllUsersUseCase } from '../../../application/use-cases/user/get-all-users.use-case.js';
import { UpdateUserUseCase } from '../../../application/use-cases/user/update-user.use-case.js';
import { DeleteUserUseCase } from '../../../application/use-cases/user/delete-user.use-case.js';
import { AddAnimeToListUseCase } from '../../../application/use-cases/user/add-anime-to-list.use-case.js';
import { RemoveAnimeFromListUseCase } from '../../../application/use-cases/user/remove-anime-from-list.use-case.js';
import { ToggleAnimeLikeUseCase } from '../../../application/use-cases/user/toggle-anime-like.use-case.js';
import { UpdateMovieStatusUseCase } from '../../../application/use-cases/user/update-movie-status.use-case.js';
import { UpdateSeasonStatusUseCase } from '../../../application/use-cases/user/update-season-status.use-case.js';
import {
  UserInputDTO,
  UpdateUserInputDTO,
  AddAnimeToListInputDTO,
  RemoveAnimeFromListInputDTO,
  ToggleAnimeLikeInputDTO,
  UpdateMovieStatusInputDTO,
  UpdateSeasonStatusInputDTO,
} from '../../../application/dtos/user.dto.js';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly addAnimeToListUseCase: AddAnimeToListUseCase,
    private readonly removeAnimeFromListUseCase: RemoveAnimeFromListUseCase,
    private readonly toggleAnimeLikeUseCase: ToggleAnimeLikeUseCase,
    private readonly updateMovieStatusUseCase: UpdateMovieStatusUseCase,
    private readonly updateSeasonStatusUseCase: UpdateSeasonStatusUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: UserInputDTO = {
        imageUrl: req.body.imageUrl,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        biography: req.body.biography ?? '',
        role: req.body.role,
      };

      const user = await this.createUserUseCase.execute(input);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await this.getUserByIdUseCase.execute(id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.execute();

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const input: UpdateUserInputDTO = {
        id,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        biography: req.body.biography,
        imageUrl: req.body.imageUrl,
      };

      const user = await this.updateUserUseCase.execute(input);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await this.deleteUserUseCase.execute(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addAnimeToList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const input: AddAnimeToListInputDTO = {
        userId: id,
        animeId: req.body.animeId,
      };

      const user = await this.addAnimeToListUseCase.execute(input);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async removeAnimeFromList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, animeId } = req.params;

      const input: RemoveAnimeFromListInputDTO = {
        userId: id,
        animeId,
      };

      const user = await this.removeAnimeFromListUseCase.execute(input);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async toggleAnimeLike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, animeId } = req.params;

      const input: ToggleAnimeLikeInputDTO = {
        userId: id,
        animeId,
      };

      const user = await this.toggleAnimeLikeUseCase.execute(input);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateMovieStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, animeId } = req.params;

      const input: UpdateMovieStatusInputDTO = {
        userId: id,
        animeId,
        movie: {
          name: req.body.movie.name,
          releaseDate: new Date(req.body.movie.releaseDate),
        },
        status: req.body.status,
        isLiked: req.body.isLiked ?? false,
      };

      const user = await this.updateMovieStatusUseCase.execute(input);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateSeasonStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, animeId } = req.params;

      const input: UpdateSeasonStatusInputDTO = {
        userId: id,
        animeId,
        season: {
          seasonNumber: req.body.season.seasonNumber,
          releaseDate: new Date(req.body.season.releaseDate),
          totalEpisodes: req.body.season.totalEpisodes,
        },
        status: req.body.status,
        lastEpisodeWatched: req.body.lastEpisodeWatched ?? 0,
        isLiked: req.body.isLiked ?? false,
      };

      const user = await this.updateSeasonStatusUseCase.execute(input);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
