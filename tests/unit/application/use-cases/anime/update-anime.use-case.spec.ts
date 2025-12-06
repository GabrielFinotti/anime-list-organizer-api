import { UpdateAnimeUseCase } from '../../../../../src/application/use-cases/anime/update-anime.use-case';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository';
import { ICategoryRepository } from '../../../../../src/domain/repositories/category.repository';
import Anime from '../../../../../src/domain/entities/Anime.entity';
import Category from '../../../../../src/domain/entities/Category.entity';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import Season from '../../../../../src/domain/value-objects/season.value-object';
import { NotFoundError } from '../../../../../src/application/errors';

describe('UpdateAnimeUseCase', () => {
  let useCase: UpdateAnimeUseCase;
  let mockAnimeRepository: jest.Mocked<IAnimeRepository>;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    mockAnimeRepository = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCategoryRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UpdateAnimeUseCase(mockAnimeRepository, mockCategoryRepository);
  });

  it('should update anime name successfully', async () => {
    const category = Category.create('Shounen', 'Shounen', 'Teens', 'Shounen description');
    const genre = Genre.create('Action', 'Action description', false);

    const anime = Anime.create({
      imageUrl: 'https://example.com/image.jpg',
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
    });

    const input = {
      id: anime.id.value,
      name: 'Naruto Shippuden',
    };

    mockAnimeRepository.findById.mockResolvedValue(anime);
    mockAnimeRepository.update.mockImplementation(async (a) => a);

    const result = await useCase.execute(input);

    expect(result.name).toBe('naruto shippuden');
    expect(mockAnimeRepository.update).toHaveBeenCalled();
  });

  it('should update anime category successfully', async () => {
    const category = Category.create('Shounen', 'Shounen', 'Teens', 'Shounen description');
    const newCategory = Category.create('Seinen', 'Seinen', 'Adults', 'Seinen description');
    const genre = Genre.create('Action', 'Action description', false);

    const anime = Anime.create({
      imageUrl: 'https://example.com/image.jpg',
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
    });

    const input = {
      id: anime.id.value,
      categoryId: newCategory.id.value,
    };

    mockAnimeRepository.findById.mockResolvedValue(anime);
    mockCategoryRepository.findById.mockResolvedValue(newCategory);
    mockAnimeRepository.update.mockImplementation(async (a) => a);

    const result = await useCase.execute(input);

    expect(result.category.name).toBe('seinen');
  });

  it('should throw NotFoundError when anime not found', async () => {
    const input = {
      id: 'non-existent-id',
      name: 'New Name',
    };

    mockAnimeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(input)).rejects.toThrow('Anime');
  });

  it('should throw NotFoundError when new category not found', async () => {
    const category = Category.create('Shounen', 'Shounen', 'Teens', 'Shounen description');
    const genre = Genre.create('Action', 'Action description', false);

    const anime = Anime.create({
      imageUrl: 'https://example.com/image.jpg',
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
    });

    const input = {
      id: anime.id.value,
      categoryId: 'non-existent-category',
    };

    mockAnimeRepository.findById.mockResolvedValue(anime);
    mockCategoryRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(input)).rejects.toThrow('Category');
  });
});
