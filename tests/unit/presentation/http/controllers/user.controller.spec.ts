import { Request, Response, NextFunction } from 'express';
import { UserController } from '../../../../../src/presentation/http/controllers/user.controller';
import { CreateUserUseCase } from '../../../../../src/application/use-cases/user/create-user.use-case';
import { GetUserByIdUseCase } from '../../../../../src/application/use-cases/user/get-user-by-id.use-case';
import { GetAllUsersUseCase } from '../../../../../src/application/use-cases/user/get-all-users.use-case';
import { UpdateUserUseCase } from '../../../../../src/application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../../../../src/application/use-cases/user/delete-user.use-case';
import { AddAnimeToListUseCase } from '../../../../../src/application/use-cases/user/add-anime-to-list.use-case';
import { RemoveAnimeFromListUseCase } from '../../../../../src/application/use-cases/user/remove-anime-from-list.use-case';
import { ToggleAnimeLikeUseCase } from '../../../../../src/application/use-cases/user/toggle-anime-like.use-case';
import { UpdateMovieStatusUseCase } from '../../../../../src/application/use-cases/user/update-movie-status.use-case';
import { UpdateSeasonStatusUseCase } from '../../../../../src/application/use-cases/user/update-season-status.use-case';
import { UserOutputDTO } from '../../../../../src/application/dtos/user.dto';

describe('UserController', () => {
  let userController: UserController;
  let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>;
  let mockGetUserByIdUseCase: jest.Mocked<GetUserByIdUseCase>;
  let mockGetAllUsersUseCase: jest.Mocked<GetAllUsersUseCase>;
  let mockUpdateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let mockDeleteUserUseCase: jest.Mocked<DeleteUserUseCase>;
  let mockAddAnimeToListUseCase: jest.Mocked<AddAnimeToListUseCase>;
  let mockRemoveAnimeFromListUseCase: jest.Mocked<RemoveAnimeFromListUseCase>;
  let mockToggleAnimeLikeUseCase: jest.Mocked<ToggleAnimeLikeUseCase>;
  let mockUpdateMovieStatusUseCase: jest.Mocked<UpdateMovieStatusUseCase>;
  let mockUpdateSeasonStatusUseCase: jest.Mocked<UpdateSeasonStatusUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  const mockUserOutput: UserOutputDTO = {
    id: 'user-123',
    imageUrl: 'https://example.com/avatar.jpg',
    username: 'testuser',
    email: 'test@example.com',
    biography: 'Test biography',
    animeList: {
      list: [],
      updatedAt: new Date(),
    },
    favoriteAnimes: [],
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockCreateUserUseCase = { execute: jest.fn() } as any;
    mockGetUserByIdUseCase = { execute: jest.fn() } as any;
    mockGetAllUsersUseCase = { execute: jest.fn() } as any;
    mockUpdateUserUseCase = { execute: jest.fn() } as any;
    mockDeleteUserUseCase = { execute: jest.fn() } as any;
    mockAddAnimeToListUseCase = { execute: jest.fn() } as any;
    mockRemoveAnimeFromListUseCase = { execute: jest.fn() } as any;
    mockToggleAnimeLikeUseCase = { execute: jest.fn() } as any;
    mockUpdateMovieStatusUseCase = { execute: jest.fn() } as any;
    mockUpdateSeasonStatusUseCase = { execute: jest.fn() } as any;

    userController = new UserController(
      mockCreateUserUseCase,
      mockGetUserByIdUseCase,
      mockGetAllUsersUseCase,
      mockUpdateUserUseCase,
      mockDeleteUserUseCase,
      mockAddAnimeToListUseCase,
      mockRemoveAnimeFromListUseCase,
      mockToggleAnimeLikeUseCase,
      mockUpdateMovieStatusUseCase,
      mockUpdateSeasonStatusUseCase,
    );

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user and return 201', async () => {
      mockRequest.body = {
        imageUrl: 'https://example.com/avatar.jpg',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        biography: 'Test biography',
        role: 'user',
      };

      mockCreateUserUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith({
        imageUrl: 'https://example.com/avatar.jpg',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        biography: 'Test biography',
        role: 'user',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserOutput);
    });

    it('should use default empty biography when not provided', async () => {
      mockRequest.body = {
        imageUrl: 'https://example.com/avatar.jpg',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      };

      mockCreateUserUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          biography: '',
        }),
      );
    });

    it('should call next with error when create fails', async () => {
      mockRequest.body = { username: 'testuser' };

      const error = new Error('Create failed');
      mockCreateUserUseCase.execute.mockRejectedValue(error);

      await userController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('should get a user by id and return 200', async () => {
      mockRequest.params = { id: 'user-123' };

      mockGetUserByIdUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserOutput);
    });

    it('should call next with error when getById fails', async () => {
      mockRequest.params = { id: 'user-123' };

      const error = new Error('User not found');
      mockGetUserByIdUseCase.execute.mockRejectedValue(error);

      await userController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAll', () => {
    it('should get all users and return 200', async () => {
      const users = [mockUserOutput];
      mockGetAllUsersUseCase.execute.mockResolvedValue(users);

      await userController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockGetAllUsersUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(users);
    });

    it('should call next with error when getAll fails', async () => {
      const error = new Error('Failed to get users');
      mockGetAllUsersUseCase.execute.mockRejectedValue(error);

      await userController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update a user and return 200', async () => {
      mockRequest.params = { id: 'user-123' };
      mockRequest.body = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      mockUpdateUserUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
        id: 'user-123',
        username: 'updateduser',
        email: 'updated@example.com',
        password: undefined,
        biography: undefined,
        imageUrl: undefined,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserOutput);
    });

    it('should call next with error when update fails', async () => {
      mockRequest.params = { id: 'user-123' };
      mockRequest.body = { username: 'updateduser' };

      const error = new Error('Update failed');
      mockUpdateUserUseCase.execute.mockRejectedValue(error);

      await userController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('should delete a user and return 204', async () => {
      mockRequest.params = { id: 'user-123' };

      mockDeleteUserUseCase.execute.mockResolvedValue(undefined);

      await userController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should call next with error when delete fails', async () => {
      mockRequest.params = { id: 'user-123' };

      const error = new Error('Delete failed');
      mockDeleteUserUseCase.execute.mockRejectedValue(error);

      await userController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addAnimeToList', () => {
    it('should add anime to user list and return 200', async () => {
      mockRequest.params = { id: 'user-123' };
      mockRequest.body = { animeId: 'anime-456' };

      mockAddAnimeToListUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.addAnimeToList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockAddAnimeToListUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-123',
        animeId: 'anime-456',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserOutput);
    });

    it('should call next with error when addAnimeToList fails', async () => {
      mockRequest.params = { id: 'user-123' };
      mockRequest.body = { animeId: 'anime-456' };

      const error = new Error('Add anime to list failed');
      mockAddAnimeToListUseCase.execute.mockRejectedValue(error);

      await userController.addAnimeToList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('removeAnimeFromList', () => {
    it('should remove anime from user list and return 200', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };

      mockRemoveAnimeFromListUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.removeAnimeFromList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRemoveAnimeFromListUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-123',
        animeId: 'anime-456',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserOutput);
    });

    it('should call next with error when removeAnimeFromList fails', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };

      const error = new Error('Remove anime from list failed');
      mockRemoveAnimeFromListUseCase.execute.mockRejectedValue(error);

      await userController.removeAnimeFromList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('toggleAnimeLike', () => {
    it('should toggle anime like and return 200', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };

      mockToggleAnimeLikeUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.toggleAnimeLike(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockToggleAnimeLikeUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-123',
        animeId: 'anime-456',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserOutput);
    });

    it('should call next with error when toggleAnimeLike fails', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };

      const error = new Error('Toggle anime like failed');
      mockToggleAnimeLikeUseCase.execute.mockRejectedValue(error);

      await userController.toggleAnimeLike(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateMovieStatus', () => {
    it('should update movie status and return 200', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };
      mockRequest.body = {
        movie: {
          name: 'Movie Title',
          releaseDate: '2024-01-01',
        },
        status: 'watching',
        isLiked: true,
      };

      mockUpdateMovieStatusUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.updateMovieStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockUpdateMovieStatusUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-123',
        animeId: 'anime-456',
        movie: {
          name: 'Movie Title',
          releaseDate: new Date('2024-01-01'),
        },
        status: 'watching',
        isLiked: true,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserOutput);
    });

    it('should use default isLiked value when not provided', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };
      mockRequest.body = {
        movie: {
          name: 'Movie Title',
          releaseDate: '2024-01-01',
        },
        status: 'watching',
      };

      mockUpdateMovieStatusUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.updateMovieStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockUpdateMovieStatusUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          isLiked: false,
        }),
      );
    });

    it('should call next with error when updateMovieStatus fails', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };
      mockRequest.body = {
        movie: { name: 'Movie Title', releaseDate: '2024-01-01' },
        status: 'watching',
      };

      const error = new Error('Update movie status failed');
      mockUpdateMovieStatusUseCase.execute.mockRejectedValue(error);

      await userController.updateMovieStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateSeasonStatus', () => {
    it('should update season status and return 200', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };
      mockRequest.body = {
        season: {
          seasonNumber: 1,
          releaseDate: '2024-01-01',
          totalEpisodes: 12,
        },
        status: 'watching',
        lastEpisodeWatched: 5,
        isLiked: true,
      };

      mockUpdateSeasonStatusUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.updateSeasonStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockUpdateSeasonStatusUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-123',
        animeId: 'anime-456',
        season: {
          seasonNumber: 1,
          releaseDate: new Date('2024-01-01'),
          totalEpisodes: 12,
        },
        status: 'watching',
        lastEpisodeWatched: 5,
        isLiked: true,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserOutput);
    });

    it('should use default values when not provided', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };
      mockRequest.body = {
        season: {
          seasonNumber: 1,
          releaseDate: '2024-01-01',
          totalEpisodes: 12,
        },
        status: 'watching',
      };

      mockUpdateSeasonStatusUseCase.execute.mockResolvedValue(mockUserOutput);

      await userController.updateSeasonStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockUpdateSeasonStatusUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          lastEpisodeWatched: 0,
          isLiked: false,
        }),
      );
    });

    it('should call next with error when updateSeasonStatus fails', async () => {
      mockRequest.params = { id: 'user-123', animeId: 'anime-456' };
      mockRequest.body = {
        season: { seasonNumber: 1, releaseDate: '2024-01-01', totalEpisodes: 12 },
        status: 'watching',
      };

      const error = new Error('Update season status failed');
      mockUpdateSeasonStatusUseCase.execute.mockRejectedValue(error);

      await userController.updateSeasonStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
