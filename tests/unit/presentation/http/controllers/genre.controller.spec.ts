import { Request, Response, NextFunction } from 'express';
import { GenreController } from '../../../../../src/presentation/http/controllers/genre.controller';
import { CreateGenreUseCase } from '../../../../../src/application/use-cases/genre/create-genre.use-case';
import { GetGenreByIdUseCase } from '../../../../../src/application/use-cases/genre/get-genre-by-id.use-case';
import { GetAllGenresUseCase } from '../../../../../src/application/use-cases/genre/get-all-genres.use-case';
import { DeleteGenreUseCase } from '../../../../../src/application/use-cases/genre/delete-genre.use-case';
import { GenreOutputDTO } from '../../../../../src/application/dtos/genre.dto';

describe('GenreController', () => {
  let genreController: GenreController;
  let mockCreateGenreUseCase: jest.Mocked<CreateGenreUseCase>;
  let mockGetGenreByIdUseCase: jest.Mocked<GetGenreByIdUseCase>;
  let mockGetAllGenresUseCase: jest.Mocked<GetAllGenresUseCase>;
  let mockDeleteGenreUseCase: jest.Mocked<DeleteGenreUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  const mockGenreOutput: GenreOutputDTO = {
    id: 'genre-123',
    name: 'Action',
    description: 'Action genre',
    isAdultContent: false,
  };

  beforeEach(() => {
    mockCreateGenreUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetGenreByIdUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetAllGenresUseCase = {
      execute: jest.fn(),
    } as any;

    mockDeleteGenreUseCase = {
      execute: jest.fn(),
    } as any;

    genreController = new GenreController(
      mockCreateGenreUseCase,
      mockGetGenreByIdUseCase,
      mockGetAllGenresUseCase,
      mockDeleteGenreUseCase,
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
    it('should create a genre and return 201', async () => {
      mockRequest.body = {
        name: 'Action',
        description: 'Action genre',
        isAdultContent: false,
      };

      mockCreateGenreUseCase.execute.mockResolvedValue(mockGenreOutput);

      await genreController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockCreateGenreUseCase.execute).toHaveBeenCalledWith({
        name: 'Action',
        description: 'Action genre',
        isAdultContent: false,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockGenreOutput);
    });

    it('should use default value for isAdultContent when not provided', async () => {
      mockRequest.body = {
        name: 'Action',
        description: 'Action genre',
      };

      mockCreateGenreUseCase.execute.mockResolvedValue(mockGenreOutput);

      await genreController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockCreateGenreUseCase.execute).toHaveBeenCalledWith({
        name: 'Action',
        description: 'Action genre',
        isAdultContent: false,
      });
    });

    it('should call next with error when create fails', async () => {
      mockRequest.body = {
        name: 'Action',
        description: 'Action genre',
      };

      const error = new Error('Create failed');
      mockCreateGenreUseCase.execute.mockRejectedValue(error);

      await genreController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('should get a genre by id and return 200', async () => {
      mockRequest.params = { id: 'genre-123' };

      mockGetGenreByIdUseCase.execute.mockResolvedValue(mockGenreOutput);

      await genreController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockGetGenreByIdUseCase.execute).toHaveBeenCalledWith('genre-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockGenreOutput);
    });

    it('should call next with error when getById fails', async () => {
      mockRequest.params = { id: 'genre-123' };

      const error = new Error('Genre not found');
      mockGetGenreByIdUseCase.execute.mockRejectedValue(error);

      await genreController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAll', () => {
    it('should get all genres and return 200', async () => {
      const genres = [mockGenreOutput];
      mockGetAllGenresUseCase.execute.mockResolvedValue(genres);

      await genreController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockGetAllGenresUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(genres);
    });

    it('should call next with error when getAll fails', async () => {
      const error = new Error('Failed to get genres');
      mockGetAllGenresUseCase.execute.mockRejectedValue(error);

      await genreController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('should delete a genre and return 204', async () => {
      mockRequest.params = { id: 'genre-123' };

      mockDeleteGenreUseCase.execute.mockResolvedValue(undefined);

      await genreController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockDeleteGenreUseCase.execute).toHaveBeenCalledWith('genre-123');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should call next with error when delete fails', async () => {
      mockRequest.params = { id: 'genre-123' };

      const error = new Error('Delete failed');
      mockDeleteGenreUseCase.execute.mockRejectedValue(error);

      await genreController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
