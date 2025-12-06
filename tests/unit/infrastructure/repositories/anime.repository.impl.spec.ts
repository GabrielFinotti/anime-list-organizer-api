import Anime from '../../../../src/domain/entities/Anime.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import AnimeRepositoryImpl from '../../../../src/infrastructure/repositories/anime.repository.impl';
import AnimeModel from '../../../../src/infrastructure/database/models/anime.model';
import AnimePersistenceMapper from '../../../../src/infrastructure/mappers/anime.persistence-mapper';
import { ICategoryRepository } from '../../../../src/domain/repositories/category.repository';
import { IGenreRepository } from '../../../../src/domain/repositories/genre.repository';

jest.mock('../../../../src/infrastructure/database/models/anime.model');

describe('AnimeRepositoryImpl', () => {
  let repository: AnimeRepositoryImpl;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;
  let mockGenreRepository: jest.Mocked<IGenreRepository>;

  const mockCategory = Category.toDomain({
    id: '01KB3H4ZMD9J0NT3JQG8XTXWN0',
    name: 'shounen',
    translatedName: 'shounen',
    targetAudience: 'Young Males',
    description: 'Anime targeted at young male audiences',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  });

  const mockGenre = Genre.toDomain({
    id: '01KB3H4ZMG6MV4JQFN89N03J4G',
    name: 'action',
    description: 'Action-packed anime with exciting battles',
    isAdultContent: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  });

  const mockAnimeDoc = {
    _id: '01KB3H4ZMGGDDK6MSS8SQ8GXQ6',
    imageUrl: 'https://example.com/image.jpg',
    name: 'Naruto',
    synopsis: 'A young ninja who seeks recognition from his peers.',
    category: '01KB3H4ZMD9J0NT3JQG8XTXWN0',
    genres: ['01KB3H4ZMG6MV4JQFN89N03J4G'],
    animeType: 'serie' as const,
    productionType: 'adaptation' as const,
    typeOfMaterialOrigin: 'manga' as const,
    movies: [{ title: 'Naruto Movie', releaseDate: new Date('2024-01-01') }],
    seasons: [{ seasonNumber: 1, releaseDate: new Date('2024-01-01'), totalEpisodes: 12 }],
    isAdultContent: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

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

    repository = new AnimeRepositoryImpl(mockCategoryRepository, mockGenreRepository);
  });

  describe('findById', () => {
    it('should return an anime when found', async () => {
      (AnimeModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockAnimeDoc),
      });
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockGenreRepository.findById.mockResolvedValue(mockGenre);

      const result = await repository.findById(mockAnimeDoc._id);

      expect(AnimeModel.findById).toHaveBeenCalledWith(mockAnimeDoc._id);
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(mockAnimeDoc.category);
      expect(mockGenreRepository.findById).toHaveBeenCalledWith(mockAnimeDoc.genres[0]);
      expect(result).not.toBeNull();
      expect(result?.id.value).toBe(mockAnimeDoc._id);
      expect(result?.name.value).toBe(mockAnimeDoc.name.toLowerCase());
    });

    it('should return null when anime not found', async () => {
      (AnimeModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findById('nonexistent-id');

      expect(result).toBeNull();
    });

    it('should throw error when category not found', async () => {
      (AnimeModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockAnimeDoc),
      });
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(repository.findById(mockAnimeDoc._id)).rejects.toThrow(
        `Category with id ${mockAnimeDoc.category} not found`,
      );
    });

    it('should throw error when genre not found', async () => {
      (AnimeModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockAnimeDoc),
      });
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockGenreRepository.findById.mockResolvedValue(null);

      await expect(repository.findById(mockAnimeDoc._id)).rejects.toThrow(
        `Genre with id ${mockAnimeDoc.genres[0]} not found`,
      );
    });
  });

  describe('findByTitle', () => {
    it('should return an anime when found by title', async () => {
      (AnimeModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockAnimeDoc),
      });
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockGenreRepository.findById.mockResolvedValue(mockGenre);

      const result = await repository.findByTitle('Naruto');

      expect(AnimeModel.findOne).toHaveBeenCalledWith({ name: 'Naruto' });
      expect(result).not.toBeNull();
      expect(result?.name.value).toBe(mockAnimeDoc.name.toLowerCase());
    });

    it('should return null when anime not found by title', async () => {
      (AnimeModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findByTitle('Nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all animes', async () => {
      const mockAnimeDocs = [
        mockAnimeDoc,
        {
          ...mockAnimeDoc,
          _id: '01KB3H4ZMGPXS8WHW5PE18Q5AD',
          name: 'One Piece',
        },
      ];

      (AnimeModel.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockAnimeDocs),
      });
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockGenreRepository.findById.mockResolvedValue(mockGenre);

      const result = await repository.findAll();

      expect(AnimeModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no animes exist', async () => {
      (AnimeModel.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      });

      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create an anime successfully', async () => {
      const anime = Anime.toDomain({
        id: mockAnimeDoc._id,
        imageUrl: mockAnimeDoc.imageUrl,
        name: mockAnimeDoc.name,
        synopsis: mockAnimeDoc.synopsis,
        category: mockCategory,
        genres: [mockGenre],
        animeType: mockAnimeDoc.animeType,
        productionType: mockAnimeDoc.productionType,
        typeOfMaterialOrigin: mockAnimeDoc.typeOfMaterialOrigin,
        movies: [],
        seasons: [],
        isAdultContent: mockAnimeDoc.isAdultContent,
        createdAt: mockAnimeDoc.createdAt,
        updatedAt: mockAnimeDoc.updatedAt,
      });

      (AnimeModel.create as jest.Mock).mockResolvedValue(mockAnimeDoc);

      const result = await repository.create(anime);

      expect(AnimeModel.create).toHaveBeenCalledWith(AnimePersistenceMapper.toPersistence(anime));
      expect(result).toBe(anime);
    });
  });

  describe('update', () => {
    it('should update an anime successfully', async () => {
      const anime = Anime.toDomain({
        id: mockAnimeDoc._id,
        imageUrl: mockAnimeDoc.imageUrl,
        name: mockAnimeDoc.name,
        synopsis: mockAnimeDoc.synopsis,
        category: mockCategory,
        genres: [mockGenre],
        animeType: mockAnimeDoc.animeType,
        productionType: mockAnimeDoc.productionType,
        typeOfMaterialOrigin: mockAnimeDoc.typeOfMaterialOrigin,
        movies: [],
        seasons: [],
        isAdultContent: mockAnimeDoc.isAdultContent,
        createdAt: mockAnimeDoc.createdAt,
        updatedAt: mockAnimeDoc.updatedAt,
      });

      (AnimeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockAnimeDoc);

      const result = await repository.update(anime);

      expect(AnimeModel.findByIdAndUpdate).toHaveBeenCalledWith(
        anime.id.value,
        AnimePersistenceMapper.toPersistence(anime),
      );
      expect(result).toBe(anime);
    });
  });

  describe('delete', () => {
    it('should delete an anime by id', async () => {
      (AnimeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockAnimeDoc);

      await repository.delete(mockAnimeDoc._id);

      expect(AnimeModel.findByIdAndDelete).toHaveBeenCalledWith(mockAnimeDoc._id);
    });
  });
});
