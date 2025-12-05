import { LookupAnimeUseCase } from '../../../../../src/application/use-cases/anime/lookup-anime.use-case';
import {
  ILookupAnimeService,
  PromptResponse,
} from '../../../../../src/application/services/lookupAnime.service';
import ApplicationError from '../../../../../src/application/errors/application.error';

describe('LookupAnimeUseCase', () => {
  let useCase: LookupAnimeUseCase;
  let mockLookupAnimeService: jest.Mocked<ILookupAnimeService>;

  const mockPromptResponse: PromptResponse = {
    anime: {
      name: 'Naruto',
      synopsis: 'Uma história sobre um ninja chamado Naruto Uzumaki que sonha em se tornar Hokage',
      category: 'Shounen',
      genres: ['Action', 'Adventure'],
      animeType: 'serie',
      productionType: 'adaptation',
      movies: [{ title: 'Naruto the Movie', releaseDate: new Date('2004-08-21') }],
      seasons: [{ seasonNumber: 1, releaseDate: new Date('2002-10-03'), totalEpisodes: 220 }],
      isAdultContent: false,
    },
    observedDetails: [],
  };

  beforeEach(() => {
    mockLookupAnimeService = {
      getAnimeData: jest.fn(),
    };

    useCase = new LookupAnimeUseCase(mockLookupAnimeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return anime data when given a valid title', async () => {
      mockLookupAnimeService.getAnimeData.mockResolvedValue(mockPromptResponse);

      const result = await useCase.execute('Naruto');

      expect(result).toEqual(mockPromptResponse);
      expect(mockLookupAnimeService.getAnimeData).toHaveBeenCalledWith('Naruto');
      expect(mockLookupAnimeService.getAnimeData).toHaveBeenCalledTimes(1);
    });

    it('should throw ApplicationError when title is empty string', async () => {
      await expect(useCase.execute('')).rejects.toThrow(ApplicationError);
      expect(mockLookupAnimeService.getAnimeData).not.toHaveBeenCalled();
    });

    it('should throw ApplicationError when title is only whitespace', async () => {
      await expect(useCase.execute('   ')).rejects.toThrow(ApplicationError);
      expect(mockLookupAnimeService.getAnimeData).not.toHaveBeenCalled();
    });

    it('should throw ApplicationError when title is null', async () => {
      await expect(useCase.execute(null as unknown as string)).rejects.toThrow(ApplicationError);
      expect(mockLookupAnimeService.getAnimeData).not.toHaveBeenCalled();
    });

    it('should throw ApplicationError when title is undefined', async () => {
      await expect(useCase.execute(undefined as unknown as string)).rejects.toThrow(
        ApplicationError,
      );
      expect(mockLookupAnimeService.getAnimeData).not.toHaveBeenCalled();
    });

    it('should throw ApplicationError when title is not a string', async () => {
      await expect(useCase.execute(123 as unknown as string)).rejects.toThrow(ApplicationError);
      expect(mockLookupAnimeService.getAnimeData).not.toHaveBeenCalled();
    });

    it('should throw ApplicationError when service throws an error', async () => {
      mockLookupAnimeService.getAnimeData.mockRejectedValue(new Error('API error'));

      await expect(useCase.execute('Naruto')).rejects.toThrow(ApplicationError);
      await expect(useCase.execute('Naruto')).rejects.toThrow('API error');
      expect(mockLookupAnimeService.getAnimeData).toHaveBeenCalledWith('Naruto');
    });

    it('should throw ApplicationError with status 500 when unknown error occurs', async () => {
      mockLookupAnimeService.getAnimeData.mockRejectedValue('Unknown error');

      await expect(useCase.execute('Naruto')).rejects.toThrow(ApplicationError);
      await expect(useCase.execute('Naruto')).rejects.toThrow('An unknown error occurred');
    });

    it('should return anime data with movie type', async () => {
      const movieResponse: PromptResponse = {
        anime: {
          name: 'Your Name',
          synopsis: 'Uma história de amor entre dois adolescentes que trocam de corpos',
          category: 'Romance',
          genres: ['Romance', 'Drama', 'Fantasy'],
          animeType: 'movie',
          productionType: 'original',
          movies: [{ title: 'Your Name', releaseDate: new Date('2016-08-26') }],
          seasons: [],
          isAdultContent: false,
        },
        observedDetails: [],
      };

      mockLookupAnimeService.getAnimeData.mockResolvedValue(movieResponse);

      const result = await useCase.execute('Your Name');

      expect(result.anime.animeType).toBe('movie');
      expect(result.anime.movies).toHaveLength(1);
      expect(result.anime.seasons).toHaveLength(0);
    });

    it('should return anime data with mixed type', async () => {
      const mixedResponse: PromptResponse = {
        anime: {
          name: 'Dragon Ball Z',
          synopsis: 'Goku e seus amigos protegem a Terra de vilões poderosos',
          category: 'Shounen',
          genres: ['Action', 'Adventure'],
          animeType: 'mixed',
          productionType: 'adaptation',
          movies: [{ title: 'Dragon Ball Z: Dead Zone', releaseDate: new Date('1989-07-15') }],
          seasons: [{ seasonNumber: 1, releaseDate: new Date('1989-04-26'), totalEpisodes: 39 }],
          isAdultContent: false,
        },
        observedDetails: [],
      };

      mockLookupAnimeService.getAnimeData.mockResolvedValue(mixedResponse);

      const result = await useCase.execute('Dragon Ball Z');

      expect(result.anime.animeType).toBe('mixed');
      expect(result.anime.movies.length).toBeGreaterThanOrEqual(1);
      expect(result.anime.seasons.length).toBeGreaterThanOrEqual(1);
    });

    it('should return anime data with observed details when information is incomplete', async () => {
      const incompleteResponse: PromptResponse = {
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
      };

      mockLookupAnimeService.getAnimeData.mockResolvedValue(incompleteResponse);

      const result = await useCase.execute('Unknown Anime');

      expect(result.observedDetails).toContain('synopsis');
      expect(result.observedDetails).toContain('category');
      expect(result.observedDetails).toContain('genres');
      expect(result.observedDetails).toContain('seasons');
    });

    it('should return adult content anime data', async () => {
      const adultResponse: PromptResponse = {
        anime: {
          name: 'Adult Anime',
          synopsis: 'Um anime para adultos',
          category: 'Seinen',
          genres: ['Action', 'Ecchi'],
          animeType: 'serie',
          productionType: 'original',
          movies: [],
          seasons: [{ seasonNumber: 1, releaseDate: new Date('2020-01-01'), totalEpisodes: 12 }],
          isAdultContent: true,
        },
        observedDetails: [],
      };

      mockLookupAnimeService.getAnimeData.mockResolvedValue(adultResponse);

      const result = await useCase.execute('Adult Anime');

      expect(result.anime.isAdultContent).toBe(true);
    });

    it('should handle anime with multiple seasons', async () => {
      const multiSeasonResponse: PromptResponse = {
        anime: {
          name: 'Attack on Titan',
          synopsis: 'A humanidade luta pela sobrevivência contra titãs gigantes',
          category: 'Shounen',
          genres: ['Action', 'Drama', 'Horror'],
          animeType: 'serie',
          productionType: 'adaptation',
          movies: [],
          seasons: [
            { seasonNumber: 1, releaseDate: new Date('2013-04-07'), totalEpisodes: 25 },
            { seasonNumber: 2, releaseDate: new Date('2017-04-01'), totalEpisodes: 12 },
            { seasonNumber: 3, releaseDate: new Date('2018-07-23'), totalEpisodes: 22 },
            { seasonNumber: 4, releaseDate: new Date('2020-12-07'), totalEpisodes: 28 },
          ],
          isAdultContent: false,
        },
        observedDetails: [],
      };

      mockLookupAnimeService.getAnimeData.mockResolvedValue(multiSeasonResponse);

      const result = await useCase.execute('Attack on Titan');

      expect(result.anime.seasons).toHaveLength(4);
      expect(result.anime.seasons[0].seasonNumber).toBe(1);
      expect(result.anime.seasons[3].seasonNumber).toBe(4);
    });

    it('should handle anime with multiple movies', async () => {
      const multiMovieResponse: PromptResponse = {
        anime: {
          name: 'Demon Slayer',
          synopsis: 'Tanjiro luta contra demônios para salvar sua irmã',
          category: 'Shounen',
          genres: ['Action', 'Adventure', 'Supernatural'],
          animeType: 'mixed',
          productionType: 'adaptation',
          movies: [
            { title: 'Demon Slayer: Mugen Train', releaseDate: new Date('2020-10-16') },
            {
              title: 'Demon Slayer: To the Swordsmith Village',
              releaseDate: new Date('2023-02-03'),
            },
          ],
          seasons: [{ seasonNumber: 1, releaseDate: new Date('2019-04-06'), totalEpisodes: 26 }],
          isAdultContent: false,
        },
        observedDetails: [],
      };

      mockLookupAnimeService.getAnimeData.mockResolvedValue(multiMovieResponse);

      const result = await useCase.execute('Demon Slayer');

      expect(result.anime.movies).toHaveLength(2);
      expect(result.anime.movies[0].title).toBe('Demon Slayer: Mugen Train');
    });
  });
});
