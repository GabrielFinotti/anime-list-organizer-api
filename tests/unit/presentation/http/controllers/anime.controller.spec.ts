import { Request, Response, NextFunction } from 'express';
import { AnimeController } from '../../../../../src/presentation/http/controllers/anime.controller';
import { CreateAnimeUseCase } from '../../../../../src/application/use-cases/anime/create-anime.use-case';
import { GetAnimeByIdUseCase } from '../../../../../src/application/use-cases/anime/get-anime-by-id.use-case';
import { GetAllAnimesUseCase } from '../../../../../src/application/use-cases/anime/get-all-animes.use-case';
import { UpdateAnimeUseCase } from '../../../../../src/application/use-cases/anime/update-anime.use-case';
import { DeleteAnimeUseCase } from '../../../../../src/application/use-cases/anime/delete-anime.use-case';
import { AddMovieToAnimeUseCase } from '../../../../../src/application/use-cases/anime/add-movie-to-anime.use-case';
import { AddSeasonToAnimeUseCase } from '../../../../../src/application/use-cases/anime/add-season-to-anime.use-case';
import { AddGenreToAnimeUseCase } from '../../../../../src/application/use-cases/anime/add-genre-to-anime.use-case';
import { RemoveMovieFromAnimeUseCase } from '../../../../../src/application/use-cases/anime/remove-movie-from-anime.use-case';
import { RemoveSeasonFromAnimeUseCase } from '../../../../../src/application/use-cases/anime/remove-season-from-anime.use-case';
import { RemoveGenreFromAnimeUseCase } from '../../../../../src/application/use-cases/anime/remove-genre-from-anime.use-case';
import { AnimeOutputDTO } from '../../../../../src/application/dtos/anime.dto';

describe('AnimeController', () => {
  let animeController: AnimeController;
  let mockCreateAnimeUseCase: jest.Mocked<CreateAnimeUseCase>;
  let mockGetAnimeByIdUseCase: jest.Mocked<GetAnimeByIdUseCase>;
  let mockGetAllAnimesUseCase: jest.Mocked<GetAllAnimesUseCase>;
  let mockUpdateAnimeUseCase: jest.Mocked<UpdateAnimeUseCase>;
  let mockDeleteAnimeUseCase: jest.Mocked<DeleteAnimeUseCase>;
  let mockAddMovieToAnimeUseCase: jest.Mocked<AddMovieToAnimeUseCase>;
  let mockAddSeasonToAnimeUseCase: jest.Mocked<AddSeasonToAnimeUseCase>;
  let mockAddGenreToAnimeUseCase: jest.Mocked<AddGenreToAnimeUseCase>;
  let mockRemoveMovieFromAnimeUseCase: jest.Mocked<RemoveMovieFromAnimeUseCase>;
  let mockRemoveSeasonFromAnimeUseCase: jest.Mocked<RemoveSeasonFromAnimeUseCase>;
  let mockRemoveGenreFromAnimeUseCase: jest.Mocked<RemoveGenreFromAnimeUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  const mockAnimeOutput: AnimeOutputDTO = {
    id: 'anime-123',
    imageUrl: 'https://example.com/image.jpg',
    name: 'Test Anime',
    synopsis: 'Test synopsis',
    category: { id: 'cat-123', name: 'Shonen' },
    genres: [{ id: 'genre-123', name: 'Action' }],
    animeType: 'TV',
    productionType: 'Serie',
    movies: [],
    seasons: [],
    isAdultContent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockCreateAnimeUseCase = { execute: jest.fn() } as any;
    mockGetAnimeByIdUseCase = { execute: jest.fn() } as any;
    mockGetAllAnimesUseCase = { execute: jest.fn() } as any;
    mockUpdateAnimeUseCase = { execute: jest.fn() } as any;
    mockDeleteAnimeUseCase = { execute: jest.fn() } as any;
    mockAddMovieToAnimeUseCase = { execute: jest.fn() } as any;
    mockAddSeasonToAnimeUseCase = { execute: jest.fn() } as any;
    mockAddGenreToAnimeUseCase = { execute: jest.fn() } as any;
    mockRemoveMovieFromAnimeUseCase = { execute: jest.fn() } as any;
    mockRemoveSeasonFromAnimeUseCase = { execute: jest.fn() } as any;
    mockRemoveGenreFromAnimeUseCase = { execute: jest.fn() } as any;

    animeController = new AnimeController(
      mockCreateAnimeUseCase,
      mockGetAnimeByIdUseCase,
      mockGetAllAnimesUseCase,
      mockUpdateAnimeUseCase,
      mockDeleteAnimeUseCase,
      mockAddMovieToAnimeUseCase,
      mockAddSeasonToAnimeUseCase,
      mockAddGenreToAnimeUseCase,
      mockRemoveMovieFromAnimeUseCase,
      mockRemoveSeasonFromAnimeUseCase,
      mockRemoveGenreFromAnimeUseCase,
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
    it('should create an anime and return 201', async () => {
      mockRequest.body = {
        imageUrl: 'https://example.com/image.jpg',
        name: 'Test Anime',
        synopsis: 'Test synopsis',
        categoryId: 'cat-123',
        genreIds: ['genre-123'],
        animeType: 'TV',
        productionType: 'Serie',
        movies: [],
        seasons: [],
        isAdultContent: false,
      };

      mockCreateAnimeUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockCreateAnimeUseCase.execute).toHaveBeenCalledWith({
        imageUrl: 'https://example.com/image.jpg',
        name: 'Test Anime',
        synopsis: 'Test synopsis',
        categoryId: 'cat-123',
        genreIds: ['genre-123'],
        animeType: 'TV',
        productionType: 'Serie',
        movies: [],
        seasons: [],
        isAdultContent: false,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimeOutput);
    });

    it('should use default values for optional fields', async () => {
      mockRequest.body = {
        imageUrl: 'https://example.com/image.jpg',
        name: 'Test Anime',
        synopsis: 'Test synopsis',
        categoryId: 'cat-123',
        animeType: 'TV',
        productionType: 'Serie',
      };

      mockCreateAnimeUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockCreateAnimeUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          genreIds: [],
          movies: [],
          seasons: [],
          isAdultContent: false,
        }),
      );
    });

    it('should call next with error when create fails', async () => {
      mockRequest.body = { name: 'Test Anime' };

      const error = new Error('Create failed');
      mockCreateAnimeUseCase.execute.mockRejectedValue(error);

      await animeController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('should get an anime by id and return 200', async () => {
      mockRequest.params = { id: 'anime-123' };

      mockGetAnimeByIdUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockGetAnimeByIdUseCase.execute).toHaveBeenCalledWith('anime-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimeOutput);
    });

    it('should call next with error when getById fails', async () => {
      mockRequest.params = { id: 'anime-123' };

      const error = new Error('Anime not found');
      mockGetAnimeByIdUseCase.execute.mockRejectedValue(error);

      await animeController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAll', () => {
    it('should get all animes and return 200', async () => {
      const animes = [mockAnimeOutput];
      mockGetAllAnimesUseCase.execute.mockResolvedValue(animes);

      await animeController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockGetAllAnimesUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(animes);
    });

    it('should call next with error when getAll fails', async () => {
      const error = new Error('Failed to get animes');
      mockGetAllAnimesUseCase.execute.mockRejectedValue(error);

      await animeController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update an anime and return 200', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = {
        name: 'Updated Anime',
        synopsis: 'Updated synopsis',
      };

      mockUpdateAnimeUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUpdateAnimeUseCase.execute).toHaveBeenCalledWith({
        id: 'anime-123',
        name: 'Updated Anime',
        synopsis: 'Updated synopsis',
        categoryId: undefined,
        animeType: undefined,
        productionType: undefined,
        isAdultContent: undefined,
        imageUrl: undefined,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimeOutput);
    });

    it('should call next with error when update fails', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = { name: 'Updated Anime' };

      const error = new Error('Update failed');
      mockUpdateAnimeUseCase.execute.mockRejectedValue(error);

      await animeController.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('should delete an anime and return 204', async () => {
      mockRequest.params = { id: 'anime-123' };

      mockDeleteAnimeUseCase.execute.mockResolvedValue(undefined);

      await animeController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockDeleteAnimeUseCase.execute).toHaveBeenCalledWith('anime-123');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should call next with error when delete fails', async () => {
      mockRequest.params = { id: 'anime-123' };

      const error = new Error('Delete failed');
      mockDeleteAnimeUseCase.execute.mockRejectedValue(error);

      await animeController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addMovie', () => {
    it('should add a movie to anime and return 200', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = {
        name: 'Movie Title',
        releaseDate: '2024-01-01',
      };

      mockAddMovieToAnimeUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.addMovie(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAddMovieToAnimeUseCase.execute).toHaveBeenCalledWith({
        animeId: 'anime-123',
        name: 'Movie Title',
        releaseDate: new Date('2024-01-01'),
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimeOutput);
    });

    it('should call next with error when addMovie fails', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = { name: 'Movie Title', releaseDate: '2024-01-01' };

      const error = new Error('Add movie failed');
      mockAddMovieToAnimeUseCase.execute.mockRejectedValue(error);

      await animeController.addMovie(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addSeason', () => {
    it('should add a season to anime and return 200', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = {
        seasonNumber: 1,
        releaseDate: '2024-01-01',
        totalEpisodes: 12,
      };

      mockAddSeasonToAnimeUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.addSeason(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAddSeasonToAnimeUseCase.execute).toHaveBeenCalledWith({
        animeId: 'anime-123',
        seasonNumber: 1,
        releaseDate: new Date('2024-01-01'),
        totalEpisodes: 12,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimeOutput);
    });

    it('should call next with error when addSeason fails', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = { seasonNumber: 1, releaseDate: '2024-01-01', totalEpisodes: 12 };

      const error = new Error('Add season failed');
      mockAddSeasonToAnimeUseCase.execute.mockRejectedValue(error);

      await animeController.addSeason(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addGenre', () => {
    it('should add a genre to anime and return 200', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = { genreId: 'genre-456' };

      mockAddGenreToAnimeUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.addGenre(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAddGenreToAnimeUseCase.execute).toHaveBeenCalledWith({
        animeId: 'anime-123',
        genreId: 'genre-456',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimeOutput);
    });

    it('should call next with error when addGenre fails', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = { genreId: 'genre-456' };

      const error = new Error('Add genre failed');
      mockAddGenreToAnimeUseCase.execute.mockRejectedValue(error);

      await animeController.addGenre(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('removeMovie', () => {
    it('should remove a movie from anime and return 200', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = {
        name: 'Movie Title',
        releaseDate: '2024-01-01',
      };

      mockRemoveMovieFromAnimeUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.removeMovie(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRemoveMovieFromAnimeUseCase.execute).toHaveBeenCalledWith({
        animeId: 'anime-123',
        name: 'Movie Title',
        releaseDate: new Date('2024-01-01'),
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimeOutput);
    });

    it('should call next with error when removeMovie fails', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = { name: 'Movie Title', releaseDate: '2024-01-01' };

      const error = new Error('Remove movie failed');
      mockRemoveMovieFromAnimeUseCase.execute.mockRejectedValue(error);

      await animeController.removeMovie(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('removeSeason', () => {
    it('should remove a season from anime and return 200', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = {
        seasonNumber: 1,
        releaseDate: '2024-01-01',
        totalEpisodes: 12,
      };

      mockRemoveSeasonFromAnimeUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.removeSeason(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRemoveSeasonFromAnimeUseCase.execute).toHaveBeenCalledWith({
        animeId: 'anime-123',
        seasonNumber: 1,
        releaseDate: new Date('2024-01-01'),
        totalEpisodes: 12,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimeOutput);
    });

    it('should call next with error when removeSeason fails', async () => {
      mockRequest.params = { id: 'anime-123' };
      mockRequest.body = { seasonNumber: 1, releaseDate: '2024-01-01', totalEpisodes: 12 };

      const error = new Error('Remove season failed');
      mockRemoveSeasonFromAnimeUseCase.execute.mockRejectedValue(error);

      await animeController.removeSeason(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('removeGenre', () => {
    it('should remove a genre from anime and return 200', async () => {
      mockRequest.params = { id: 'anime-123', genreId: 'genre-456' };

      mockRemoveGenreFromAnimeUseCase.execute.mockResolvedValue(mockAnimeOutput);

      await animeController.removeGenre(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRemoveGenreFromAnimeUseCase.execute).toHaveBeenCalledWith({
        animeId: 'anime-123',
        genreId: 'genre-456',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimeOutput);
    });

    it('should call next with error when removeGenre fails', async () => {
      mockRequest.params = { id: 'anime-123', genreId: 'genre-456' };

      const error = new Error('Remove genre failed');
      mockRemoveGenreFromAnimeUseCase.execute.mockRejectedValue(error);

      await animeController.removeGenre(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
