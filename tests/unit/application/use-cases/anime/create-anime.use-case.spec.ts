import { CreateAnimeUseCase } from '../../../../../src/application/use-cases/anime/create-anime.use-case';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository';
import { ICategoryRepository } from '../../../../../src/domain/repositories/category.repository';
import { IGenreRepository } from '../../../../../src/domain/repositories/genre.repository';
import { IImagesService } from '../../../../../src/application/services/images.service';
import { IR2Service } from '../../../../../src/application/services/r2.service';
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
  let mockImagesService: jest.Mocked<IImagesService>;
  let mockR2Service: jest.Mocked<IR2Service>;

  const createMockCategory = () =>
    Category.create('Shounen', 'Shounen', 'Teens', 'Shounen description');
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

    mockImagesService = {
      downloadImage: jest.fn(),
    };

    mockR2Service = {
      uploadObject: jest.fn(),
      updateObject: jest.fn(),
      deleteObject: jest.fn(),
    };

    useCase = new CreateAnimeUseCase(
      mockAnimeRepository,
      mockCategoryRepository,
      mockGenreRepository,
      mockImagesService,
      mockR2Service,
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

    const mockImageBuffer = Buffer.from('processed-image');
    const mockUploadedUrl = new URL('https://cdn.example.com/animes/123/naruto.webp');

    mockAnimeRepository.findByTitle.mockResolvedValue(null);
    mockCategoryRepository.findById.mockResolvedValue(category);
    mockGenreRepository.findById.mockResolvedValue(genre);
    mockImagesService.downloadImage.mockResolvedValue(mockImageBuffer);
    mockR2Service.uploadObject.mockResolvedValue(mockUploadedUrl);
    mockAnimeRepository.create.mockImplementation(async (anime) => anime);

    const result = await useCase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(input.name.toLowerCase());
    expect(result.synopsis).toBe(input.synopsis);
    expect(result.category.name).toBe('shounen');
    expect(result.genres).toHaveLength(1);
    expect(result.animeType).toBe('serie');
    expect(mockImagesService.downloadImage).toHaveBeenCalledWith(input.imageUrl, 'naruto');
    expect(mockR2Service.uploadObject).toHaveBeenCalled();
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
    expect(mockImagesService.downloadImage).not.toHaveBeenCalled();
    expect(mockR2Service.uploadObject).not.toHaveBeenCalled();
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
