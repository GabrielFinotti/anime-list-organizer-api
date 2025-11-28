import { AddSeasonToAnimeUseCase } from '../../../../../src/application/use-cases/anime/add-season-to-anime.use-case.js';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository.js';
import { NotFoundError } from '../../../../../src/application/errors/index.js';
import Anime from '../../../../../src/domain/entities/Anime.entity.js';
import Category from '../../../../../src/domain/entities/Category.entity.js';
import Genre from '../../../../../src/domain/entities/Genre.entity.js';
import Season from '../../../../../src/domain/value-objects/season.value-object.js';

describe('AddSeasonToAnimeUseCase', () => {
  let useCase: AddSeasonToAnimeUseCase;
  let animeRepository: jest.Mocked<IAnimeRepository>;

  const mockCategory = Category.create('Shounen', 'Action anime for boys');
  const mockGenre = Genre.create('Action', 'Action genre', false);

  const createMockAnime = () =>
    Anime.create({
      imageUrl: 'https://example.com/naruto.jpg',
      name: 'Naruto',
      synopsis: 'A ninja anime',
      category: mockCategory,
      genres: [mockGenre],
      animeType: 'serie',
      productionType: 'original',
      movies: [],
      seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date('2002-10-03'), totalEpisodes: 50 })],
      isAdultContent: false,
    });

  beforeEach(() => {
    animeRepository = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new AddSeasonToAnimeUseCase(animeRepository);
  });

  it('deve adicionar uma temporada ao anime com sucesso', async () => {
    const anime = createMockAnime();
    const seasonData = {
      animeId: anime.id.value,
      seasonNumber: 2,
      releaseDate: new Date('2007-02-15'),
      totalEpisodes: 500,
    };

    animeRepository.findById.mockResolvedValue(anime);
    animeRepository.update.mockImplementation(async (a) => a);

    const result = await useCase.execute(seasonData);

    expect(animeRepository.findById).toHaveBeenCalledWith(seasonData.animeId);
    expect(animeRepository.update).toHaveBeenCalled();
    expect(result.seasons).toHaveLength(2);
    expect(result.seasons[1].seasonNumber).toBe(2);
    expect(result.seasons[0].totalEpisodes).toBe(50);
  });

  it('deve lançar NotFoundError quando o anime não existir', async () => {
    const seasonData = {
      animeId: 'non-existent-id',
      seasonNumber: 1,
      releaseDate: new Date('2024-01-01'),
      totalEpisodes: 12,
    };

    animeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(seasonData)).rejects.toThrow(NotFoundError);
    expect(animeRepository.update).not.toHaveBeenCalled();
  });
});
