import User from '../../../../src/domain/entities/User.entity';
import Anime from '../../../../src/domain/entities/Anime.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import UserRepositoryImpl from '../../../../src/infrastructure/repositories/user.repository.impl';
import UserModel from '../../../../src/infrastructure/database/models/user.model';
import UserPersistenceMapper from '../../../../src/infrastructure/mappers/user.persistence-mapper';
import { IAnimeRepository } from '../../../../src/domain/repositories/anime.repository';

jest.mock('../../../../src/infrastructure/database/models/user.model');

describe('UserRepositoryImpl', () => {
  let repository: UserRepositoryImpl;
  let mockAnimeRepository: jest.Mocked<IAnimeRepository>;

  const mockCategory = Category.toDomain({
    id: '01KB3H4ZMD9J0NT3JQG8XTXWN0',
    name: 'shounen',
    translatedName: 'Shounen',
    targetAudience: 'Young Male',
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

  const mockAnime = Anime.toDomain({
    id: '01KB3H4ZMGGDDK6MSS8SQ8GXQ6',
    imageUrl: 'https://example.com/image.jpg',
    name: 'naruto',
    synopsis: 'A young ninja who seeks recognition from his peers.',
    category: mockCategory,
    genres: [mockGenre],
    animeType: 'serie',
    productionType: 'adaptation',
    typeOfMaterialOrigin: 'manga',
    movies: [],
    seasons: [],
    isAdultContent: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  });

  const mockUserDoc = {
    _id: '01KB3H4ZMGPXS8WHW5PE18Q5AD',
    imageUrl: 'https://example.com/avatar.jpg',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123!',
    biography: 'A passionate anime fan who loves action series',
    animeList: {
      list: [
        {
          anime: '01KB3H4ZMGGDDK6MSS8SQ8GXQ6',
          status: 'watching' as const,
          moviesStatus: [],
          seasonsStatus: [],
          isLiked: true,
        },
      ],
      updatedAt: new Date('2024-01-01'),
    },
    // favoriteAnimes removed — favorites are derived from animeList.isLiked
    role: 'user' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockAnimeRepository = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    repository = new UserRepositoryImpl(mockAnimeRepository);
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      (UserModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUserDoc),
      });
      mockAnimeRepository.findById.mockResolvedValue(mockAnime);

      const result = await repository.findById(mockUserDoc._id);

      expect(UserModel.findById).toHaveBeenCalledWith(mockUserDoc._id);
      expect(mockAnimeRepository.findById).toHaveBeenCalledWith('01KB3H4ZMGGDDK6MSS8SQ8GXQ6');
      expect(result).not.toBeNull();
      expect(result?.id.value).toBe(mockUserDoc._id);
      expect(result?.email.value).toBe(mockUserDoc.email);
    });

    it('should return null when user not found', async () => {
      (UserModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      (UserModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUserDoc),
      });
      mockAnimeRepository.findById.mockResolvedValue(mockAnime);

      const result = await repository.findByEmail('test@example.com');

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).not.toBeNull();
      expect(result?.email.value).toBe(mockUserDoc.email);
    });

    it('should return null when user not found by email', async () => {
      (UserModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUserDocs = [
        mockUserDoc,
        {
          ...mockUserDoc,
          _id: '01KB3H4ZMG7T4XPDVKHZH1NBF0',
          email: 'another@example.com',
          username: 'anotheruser',
        },
      ];

      (UserModel.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUserDocs),
      });
      mockAnimeRepository.findById.mockResolvedValue(mockAnime);

      const result = await repository.findAll();

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      (UserModel.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      });

      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const animesMap = new Map<string, Anime>();
      animesMap.set('01KB3H4ZMGGDDK6MSS8SQ8GXQ6', mockAnime);

      const user = UserPersistenceMapper.toDomain(mockUserDoc, animesMap);

      (UserModel.create as jest.Mock).mockResolvedValue(mockUserDoc);

      const result = await repository.create(user);

      expect(UserModel.create).toHaveBeenCalledWith(UserPersistenceMapper.toPersistence(user));
      expect(result).toBe(user);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const animesMap = new Map<string, Anime>();
      animesMap.set('01KB3H4ZMGGDDK6MSS8SQ8GXQ6', mockAnime);

      const user = UserPersistenceMapper.toDomain(mockUserDoc, animesMap);

      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUserDoc);

      const result = await repository.update(user);

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        user.id.value,
        UserPersistenceMapper.toPersistence(user),
      );
      expect(result).toBe(user);
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUserDoc);

      await repository.delete(mockUserDoc._id);

      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(mockUserDoc._id);
    });
  });

  describe('mapToDomain - edge cases', () => {
    it('should handle user with empty anime list', async () => {
      const emptyListUserDoc = {
        ...mockUserDoc,
        animeList: {
          list: [],
          updatedAt: new Date('2024-01-01'),
        },
        // favoriteAnimes removed
      };

      (UserModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(emptyListUserDoc),
      });

      const result = await repository.findById(emptyListUserDoc._id);

      expect(result).not.toBeNull();
      expect(result?.animeList.list).toHaveLength(0);
      expect(result?.favoriteAnimes).toHaveLength(0);
    });

    it('should not duplicate anime fetch when anime is in both lists', async () => {
      (UserModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUserDoc),
      });
      mockAnimeRepository.findById.mockResolvedValue(mockAnime);

      await repository.findById(mockUserDoc._id);

      // Should only call findById once since the anime is in both lists
      expect(mockAnimeRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
