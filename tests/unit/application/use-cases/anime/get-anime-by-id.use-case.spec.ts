import { GetAnimeByIdUseCase } from '../../../../../src/application/use-cases/anime/get-anime-by-id.use-case';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository';
import Anime from '../../../../../src/domain/entities/Anime.entity';
import Category from '../../../../../src/domain/entities/Category.entity';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import Season from '../../../../../src/domain/value-objects/season.value-object';
import { NotFoundError } from '../../../../../src/application/errors';

describe('GetAnimeByIdUseCase', () => {
  let useCase: GetAnimeByIdUseCase;
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

    useCase = new GetAnimeByIdUseCase(mockAnimeRepository);
  });

  it('should return an anime when found', async () => {
    const category = Category.create('Shounen', 'Shounen description');
    const genre = Genre.create('Action', 'Action description', false);

    const anime = Anime.create({
      imageUrl: 'https://example.com/image.jpg',
      name: 'Naruto',
      synopsis: 'A ninja story',
      category,
      genres: [genre],
      animeType: 'serie',
      productionType: 'adaptation',
      movies: [],
      seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 })],
      isAdultContent: false,
    });

    mockAnimeRepository.findById.mockResolvedValue(anime);

    const result = await useCase.execute(anime.id.value);

    expect(result.id).toBe(anime.id.value);
    expect(result.name).toBe('naruto');
    expect(result.category.name).toBe('shounen');
    expect(mockAnimeRepository.findById).toHaveBeenCalledWith(anime.id.value);
  });

  it('should throw NotFoundError when anime not found', async () => {
    const animeId = 'non-existent-id';
    mockAnimeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(animeId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(animeId)).rejects.toThrow(
      `Anime with identifier '${animeId}' not found`,
    );
  });
});
