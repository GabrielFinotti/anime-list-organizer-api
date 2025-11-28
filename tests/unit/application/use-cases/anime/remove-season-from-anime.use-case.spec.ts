import { RemoveSeasonFromAnimeUseCase } from '../../../../../src/application/use-cases/anime/remove-season-from-anime.use-case.js';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository.js';
import { NotFoundError } from '../../../../../src/application/errors/index.js';
import Anime from '../../../../../src/domain/entities/Anime.entity.js';
import Category from '../../../../../src/domain/entities/Category.entity.js';
import Genre from '../../../../../src/domain/entities/Genre.entity.js';
import Season from '../../../../../src/domain/value-objects/season.value-object.js';

describe('RemoveSeasonFromAnimeUseCase', () => {
  let useCase: RemoveSeasonFromAnimeUseCase;
  let animeRepository: jest.Mocked<IAnimeRepository>;

  const mockCategory = Category.create('Shounen', 'Action anime for boys');
  const mockGenre = Genre.create('Action', 'Action genre', false);

  const createMockAnimeWithSeason = () => {
    const season1 = Season.create({
      seasonNumber: 1,
      releaseDate: new Date('2002-10-03'),
      totalEpisodes: 220,
    });
    const season2 = Season.create({
      seasonNumber: 2,
      releaseDate: new Date('2007-02-15'),
      totalEpisodes: 500,
    });
    const anime = Anime.create({
      imageUrl: 'https://example.com/naruto.jpg',
      name: 'Naruto',
      synopsis: 'A ninja anime',
      category: mockCategory,
      genres: [mockGenre],
      animeType: 'serie',
      productionType: 'original',
      movies: [],
      seasons: [season1, season2],
      isAdultContent: false,
    });
    return anime;
  };

  beforeEach(() => {
    animeRepository = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new RemoveSeasonFromAnimeUseCase(animeRepository);
  });

  it('deve remover uma temporada do anime com sucesso', async () => {
    const anime = createMockAnimeWithSeason();
    const removeSeasonData = {
      animeId: anime.id.value,
      seasonNumber: 1,
      releaseDate: new Date('2002-10-03'),
      totalEpisodes: 220,
    };

    animeRepository.findById.mockResolvedValue(anime);
    animeRepository.update.mockImplementation(async (a) => a);

    const result = await useCase.execute(removeSeasonData);

    expect(animeRepository.findById).toHaveBeenCalledWith(removeSeasonData.animeId);
    expect(animeRepository.update).toHaveBeenCalled();
    expect(result.seasons).toHaveLength(1);
  });

  it('deve lançar NotFoundError quando o anime não existir', async () => {
    const removeSeasonData = {
      animeId: 'non-existent-id',
      seasonNumber: 1,
      releaseDate: new Date('2024-01-01'),
      totalEpisodes: 12,
    };

    animeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(removeSeasonData)).rejects.toThrow(NotFoundError);
    expect(animeRepository.update).not.toHaveBeenCalled();
  });
});
