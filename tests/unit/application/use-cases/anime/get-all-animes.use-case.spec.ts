import { GetAllAnimesUseCase } from '../../../../../src/application/use-cases/anime/get-all-animes.use-case';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository';
import Anime from '../../../../../src/domain/entities/Anime.entity';
import Category from '../../../../../src/domain/entities/Category.entity';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import Season from '../../../../../src/domain/value-objects/season.value-object';

describe('GetAllAnimesUseCase', () => {
  let useCase: GetAllAnimesUseCase;
  let mockAnimeRepository: jest.Mocked<IAnimeRepository>;

  beforeEach(() => {
    mockAnimeRepository = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetAllAnimesUseCase(mockAnimeRepository);
  });

  it('should return all animes', async () => {
    const category = Category.create('Shounen', 'Shounen', 'Teens', 'Shounen description');
    const genre = Genre.create('Action', 'Action description', false);

    const animes = [
      Anime.create({
        imageUrl: 'https://example.com/naruto.jpg',
        name: 'Naruto',
        synopsis: 'A ninja story',
        category,
        genres: [genre],
        animeType: 'serie',
        productionType: 'adaptation',
        typeOfMaterialOrigin: 'manga',
        movies: [],
        seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 })],
        isAdultContent: false,
      }),
      Anime.create({
        imageUrl: 'https://example.com/onepiece.jpg',
        name: 'One Piece',
        synopsis: 'A pirate story',
        category,
        genres: [genre],
        animeType: 'serie',
        productionType: 'adaptation',
        typeOfMaterialOrigin: 'manga',
        movies: [],
        seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 1000 })],
        isAdultContent: false,
      }),
    ];

    mockAnimeRepository.findAll.mockResolvedValue(animes);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('naruto');
    expect(result[1].name).toBe('one piece');
    expect(mockAnimeRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no animes exist', async () => {
    mockAnimeRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});
