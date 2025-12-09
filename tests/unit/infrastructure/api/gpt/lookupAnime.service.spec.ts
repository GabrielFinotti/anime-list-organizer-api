import LookupAnimeService from '../../../../../src/infrastructure/api/gpt/service/lookupAnime.service';
import { ICategoryRepository } from '../../../../../src/domain/repositories/category.repository';
import { IGenreRepository } from '../../../../../src/domain/repositories/genre.repository';
import Category from '../../../../../src/domain/entities/Category.entity';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import AnimeAgentConfig from '../../../../../src/infrastructure/api/gpt/config/animeAgent.config';

// Mock do AnimeAgentConfig
jest.mock('../../../../../src/infrastructure/api/gpt/config/animeAgent.config');

// Mock do buildPrompt
jest.mock('../../../../../src/infrastructure/api/gpt/utils/buildPrompt', () => {
  return jest.fn().mockReturnValue('mocked prompt');
});

describe('LookupAnimeService', () => {
  let service: LookupAnimeService;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;
  let mockGenreRepository: jest.Mocked<IGenreRepository>;
  let mockOpenAIClient: any;

  const createMockCategory = (name: string = 'Shounen') =>
    Category.create(name, name, 'General', `${name} description`);

  const createMockGenre = (name: string = 'Action', isAdultContent: boolean = false) =>
    Genre.create(name, `${name} description`, isAdultContent);

  const mockValidApiResponse = {
    error: null,
    output_text: JSON.stringify({
      anime: {
        name: 'Naruto',
        synopsis:
          'Uma história sobre um ninja chamado Naruto Uzumaki que sonha em se tornar Hokage',
        category: 'Shounen',
        genres: ['Action', 'Adventure'],
        animeType: 'serie',
        productionType: 'adaptation',
        movies: [{ title: 'Naruto Movie', releaseDate: '2004-08-21' }],
        seasons: [{ seasonNumber: 1, releaseDate: '2002-10-03', totalEpisodes: 220 }],
        isAdultContent: false,
      },
      observedDetails: [],
    }),
  };

  beforeEach(() => {
    mockCategoryRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    mockGenreRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    mockOpenAIClient = {
      responses: {
        create: jest.fn(),
      },
    };

    const mockAnimeAgentConfig = {
      clientInstance: mockOpenAIClient,
    };

    (AnimeAgentConfig.getInstance as jest.Mock).mockReturnValue(mockAnimeAgentConfig);

    service = new LookupAnimeService(mockCategoryRepository, mockGenreRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnimeData', () => {
    it('should return parsed anime data for a valid title', async () => {
      const categories = [createMockCategory('Shounen'), createMockCategory('Seinen')];
      const genres = [createMockGenre('Action', false), createMockGenre('Adventure', false)];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue(mockValidApiResponse);

      const result = await service.getAnimeData('Naruto');

      expect(result).toBeDefined();
      expect(result.anime.name).toBe('Naruto');
      expect(result.anime.synopsis).toContain('ninja');
      expect(result.anime.animeType).toBe('serie');
      expect(result.anime.productionType).toBe('adaptation');
      expect(mockCategoryRepository.findAll).toHaveBeenCalled();
      expect(mockGenreRepository.findAll).toHaveBeenCalled();
    });

    it('should throw error when API returns an error', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: { message: 'API Error', code: 'API_ERROR' },
        output_text: '',
      });

      await expect(service.getAnimeData('Naruto')).rejects.toThrow(
        'LookupAnimeService API error: API Error, code: API_ERROR',
      );
    });

    it('should throw error when API request fails', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockRejectedValue(new Error('Network error'));

      await expect(service.getAnimeData('Naruto')).rejects.toThrow('Network error');
    });

    it('should throw unknown error when non-Error is thrown', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockRejectedValue('Unknown error');

      await expect(service.getAnimeData('Naruto')).rejects.toThrow(
        'LookupAnimeService getAnimeData unknown error',
      );
    });

    it('should handle response with markdown code block wrapper', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: `\`\`\`json
${JSON.stringify({
  anime: {
    name: 'Test Anime',
    synopsis: 'Test synopsis',
    category: 'Shounen',
    genres: ['Action'],
    animeType: 'serie',
    productionType: 'original',
    movies: [],
    seasons: [{ seasonNumber: 1, releaseDate: '2020-01-01', totalEpisodes: 12 }],
    isAdultContent: false,
  },
  observedDetails: [],
})}
\`\`\``,
      });

      const result = await service.getAnimeData('Test Anime');

      expect(result.anime.name).toBe('Test Anime');
    });

    it('should handle movie type anime', async () => {
      const categories = [createMockCategory('Romance')];
      const genres = [createMockGenre('Romance')];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Your Name',
            synopsis: 'Uma história de amor entre dois adolescentes',
            category: 'Romance',
            genres: ['Romance', 'Drama'],
            animeType: 'movie',
            productionType: 'original',
            movies: [{ title: 'Your Name', releaseDate: '2016-08-26' }],
            seasons: [],
            isAdultContent: false,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Your Name');

      expect(result.anime.animeType).toBe('movie');
      expect(result.anime.movies).toHaveLength(1);
      expect(result.anime.seasons).toHaveLength(0);
    });

    it('should handle mixed type anime', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Dragon Ball Z',
            synopsis: 'Goku e seus amigos protegem a Terra',
            category: 'Shounen',
            genres: ['Action'],
            animeType: 'mixed',
            productionType: 'adaptation',
            movies: [{ title: 'DBZ Movie', releaseDate: '1989-07-15' }],
            seasons: [{ seasonNumber: 1, releaseDate: '1989-04-26', totalEpisodes: 39 }],
            isAdultContent: false,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Dragon Ball Z');

      expect(result.anime.animeType).toBe('mixed');
      expect(result.anime.movies.length).toBeGreaterThanOrEqual(1);
      expect(result.anime.seasons.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle adult content anime', async () => {
      const categories = [createMockCategory('Seinen')];
      const genres = [createMockGenre('Ecchi', true)];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Adult Anime',
            synopsis: 'Um anime para adultos',
            category: 'Seinen',
            genres: ['Ecchi'],
            animeType: 'serie',
            productionType: 'original',
            movies: [],
            seasons: [{ seasonNumber: 1, releaseDate: '2020-01-01', totalEpisodes: 12 }],
            isAdultContent: true,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Adult Anime');

      expect(result.anime.isAdultContent).toBe(true);
    });

    it('should handle response with observed details', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Unknown Anime',
            synopsis: '',
            category: '',
            genres: [],
            animeType: 'serie',
            productionType: 'original',
            movies: [],
            seasons: [],
            isAdultContent: false,
          },
          observedDetails: ['synopsis', 'category', 'genres', 'seasons'],
        }),
      });

      const result = await service.getAnimeData('Unknown Anime');

      expect(result.observedDetails).toContain('synopsis');
      expect(result.observedDetails).toContain('category');
      expect(result.observedDetails).toContain('genres');
    });

    it('should default animeType to serie for invalid value', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Test Anime',
            synopsis: 'Test',
            category: 'Shounen',
            genres: ['Action'],
            animeType: 'invalid',
            productionType: 'original',
            movies: [],
            seasons: [],
            isAdultContent: false,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Test Anime');

      expect(result.anime.animeType).toBe('serie');
    });

    it('should default productionType to original for invalid value', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Test Anime',
            synopsis: 'Test',
            category: 'Shounen',
            genres: ['Action'],
            animeType: 'serie',
            productionType: 'invalid',
            movies: [],
            seasons: [],
            isAdultContent: false,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Test Anime');

      expect(result.anime.productionType).toBe('original');
    });

    it('should handle invalid date in movies', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Test Anime',
            synopsis: 'Test',
            category: 'Shounen',
            genres: ['Action'],
            animeType: 'movie',
            productionType: 'original',
            movies: [{ title: 'Movie 1', releaseDate: 'invalid-date' }],
            seasons: [],
            isAdultContent: false,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Test Anime');

      expect(result.anime.movies[0].releaseDate).toEqual(new Date(0));
    });

    it('should handle empty date in seasons', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Test Anime',
            synopsis: 'Test',
            category: 'Shounen',
            genres: ['Action'],
            animeType: 'serie',
            productionType: 'original',
            movies: [],
            seasons: [{ seasonNumber: 1, releaseDate: '', totalEpisodes: 12 }],
            isAdultContent: false,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Test Anime');

      expect(result.anime.seasons[0].releaseDate).toEqual(new Date(0));
    });

    it('should handle missing fields in response', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {},
          observedDetails: null,
        }),
      });

      const result = await service.getAnimeData('Test Anime');

      expect(result.anime.name).toBe('');
      expect(result.anime.synopsis).toBe('');
      expect(result.anime.category).toBe('');
      expect(result.anime.genres).toEqual([]);
      expect(result.anime.animeType).toBe('serie');
      expect(result.anime.productionType).toBe('original');
      expect(result.anime.movies).toEqual([]);
      expect(result.anime.seasons).toEqual([]);
      expect(result.anime.isAdultContent).toBe(false);
      expect(result.observedDetails).toEqual([]);
    });

    it('should handle non-array movies in response', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Test',
            synopsis: 'Test',
            category: 'Test',
            genres: ['Test'],
            animeType: 'serie',
            productionType: 'original',
            movies: 'not-an-array',
            seasons: [],
            isAdultContent: false,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Test');

      expect(result.anime.movies).toEqual([]);
    });

    it('should handle non-array seasons in response', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Test',
            synopsis: 'Test',
            category: 'Test',
            genres: ['Test'],
            animeType: 'serie',
            productionType: 'original',
            movies: [],
            seasons: 'not-an-array',
            isAdultContent: false,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Test');

      expect(result.anime.seasons).toEqual([]);
    });

    it('should handle non-array genres in response', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: JSON.stringify({
          anime: {
            name: 'Test',
            synopsis: 'Test',
            category: 'Test',
            genres: 'not-an-array',
            animeType: 'serie',
            productionType: 'original',
            movies: [],
            seasons: [],
            isAdultContent: false,
          },
          observedDetails: [],
        }),
      });

      const result = await service.getAnimeData('Test');

      expect(result.anime.genres).toEqual([]);
    });

    it('should throw error for invalid JSON response', async () => {
      const categories = [createMockCategory()];
      const genres = [createMockGenre()];

      mockCategoryRepository.findAll.mockResolvedValue(categories);
      mockGenreRepository.findAll.mockResolvedValue(genres);
      mockOpenAIClient.responses.create.mockResolvedValue({
        error: null,
        output_text: 'invalid json {',
      });

      await expect(service.getAnimeData('Test')).rejects.toThrow();
    });
  });
});
