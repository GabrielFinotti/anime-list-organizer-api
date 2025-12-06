import { CreateAnimeUseCase } from '../../../../../src/application/use-cases/anime/create-anime.use-case';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository';
import { ICategoryRepository } from '../../../../../src/domain/repositories/category.repository';
import { IGenreRepository } from '../../../../../src/domain/repositories/genre.repository';
import Category from '../../../../../src/domain/entities/Category.entity';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import Anime from '../../../../../src/domain/entities/Anime.entity';
import Movie from '../../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../../src/domain/value-objects/season.value-object';
import { ConflictError, NotFoundError } from '../../../../../src/application/errors';

describe('CreateAnimeUseCase', () => {
  let useCase: CreateAnimeUseCase;
  let mockAnimeRepository: jest.Mocked<IAnimeRepository>;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;
  let mockGenreRepository: jest.Mocked<IGenreRepository>;

  const createMockCategory = () => Category.create('Shounen', 'Shounen', 'Teens', 'Shounen description');
  const createMockGenre = () => Genre.create('Action', 'Action description', false);

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

    mockGenreRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateAnimeUseCase(
      mockAnimeRepository,
      mockCategoryRepository,
      mockGenreRepository,
    );
  });

  it('should create an anime successfully', async () => {
    const category = createMockCategory();
    const genre = createMockGenre();

    const input = {
      imageUrl: 'https://example.com/image.jpg',
      name: 'Naruto',
      synopsis: 'A ninja story about Naruto Uzumaki',
      categoryId: category.id.value,
      genreIds: [genre.id.value],
      animeType: 'serie',
      productionType: 'adaptation',
      typeOfMaterialOrigin: 'manga',
      movies: [],
      seasons: [{ seasonNumber: 1, releaseDate: new Date('2002-10-03'), totalEpisodes: 220 }],
      isAdultContent: false,
    };

    mockAnimeRepository.findByTitle.mockResolvedValue(null);
    mockCategoryRepository.findById.mockResolvedValue(category);
    mockGenreRepository.findById.mockResolvedValue(genre);
    mockAnimeRepository.create.mockImplementation(async (anime) => anime);

    const result = await useCase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(input.name.toLowerCase());
    expect(result.synopsis).toBe(input.synopsis);
    expect(result.category.name).toBe('shounen');
    expect(result.genres).toHaveLength(1);
    expect(result.animeType).toBe('serie');
    expect(mockAnimeRepository.create).toHaveBeenCalled();
  });

  it('should throw ConflictError when anime name already exists', async () => {
    const category = createMockCategory();
    const genre = createMockGenre();

    const input = {
      imageUrl: 'https://example.com/image.jpg',
      name: 'Naruto',
      synopsis: 'A ninja story',
      categoryId: category.id.value,
      genreIds: [genre.id.value],
      animeType: 'serie',
      productionType: 'adaptation',
      typeOfMaterialOrigin: 'manga',
      movies: [],
      seasons: [{ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 }],
      isAdultContent: false,
    };

    const existingAnime = Anime.create({
      imageUrl: 'https://example.com/image.jpg',
      name: 'Naruto',
      synopsis: 'Existing anime',
      category,
      genres: [genre],
      animeType: 'serie',
      productionType: 'adaptation',
      typeOfMaterialOrigin: 'manga',
      movies: [],
      seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 })],
      isAdultContent: false,
    });

    mockAnimeRepository.findByTitle.mockResolvedValue(existingAnime);
    mockCategoryRepository.findById.mockResolvedValue(category);
    mockGenreRepository.findById.mockResolvedValue(genre);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
  });

  it('should throw NotFoundError when category not found', async () => {
    const genre = createMockGenre();

    const input = {
      imageUrl: 'https://example.com/image.jpg',
      name: 'Naruto',
      synopsis: 'A ninja story',
      categoryId: 'non-existent-category',
      genreIds: [genre.id.value],
      animeType: 'serie',
      productionType: 'adaptation',
      typeOfMaterialOrigin: 'manga',
      movies: [],
      seasons: [{ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 }],
      isAdultContent: false,
    };

    mockAnimeRepository.findByTitle.mockResolvedValue(null);
    mockCategoryRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(input)).rejects.toThrow('Category');
  });

  it('should throw NotFoundError when genre not found', async () => {
    const category = createMockCategory();

    const input = {
      imageUrl: 'https://example.com/image.jpg',
      name: 'Naruto',
      synopsis: 'A ninja story',
      categoryId: category.id.value,
      genreIds: ['non-existent-genre'],
      animeType: 'serie',
      productionType: 'adaptation',
      typeOfMaterialOrigin: 'manga',
      movies: [],
      seasons: [{ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 }],
      isAdultContent: false,
    };

    mockAnimeRepository.findByTitle.mockResolvedValue(null);
    mockCategoryRepository.findById.mockResolvedValue(category);
    mockGenreRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(input)).rejects.toThrow('Genre');
  });
});
