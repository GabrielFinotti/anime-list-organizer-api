import { UpdateSeasonStatusUseCase } from '../../../../../src/application/use-cases/user/update-season-status.use-case.js';
import { IUserRepository } from '../../../../../src/domain/repositories/user.repository.js';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository.js';
import { NotFoundError } from '../../../../../src/application/errors/index.js';
import User from '../../../../../src/domain/entities/User.entity.js';
import Anime from '../../../../../src/domain/entities/Anime.entity.js';
import Category from '../../../../../src/domain/entities/Category.entity.js';
import Genre from '../../../../../src/domain/entities/Genre.entity.js';
import Season from '../../../../../src/domain/value-objects/season.value-object.js';

describe('UpdateSeasonStatusUseCase', () => {
  let useCase: UpdateSeasonStatusUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let animeRepository: jest.Mocked<IAnimeRepository>;

  const mockCategory = Category.create('Shounen', 'Action anime for boys');
  const mockGenre = Genre.create('Action', 'Action genre', false);

  const createMockAnimeWithSeason = () => {
    const season = Season.create({
      seasonNumber: 1,
      releaseDate: new Date('2002-10-03'),
      totalEpisodes: 220,
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
      seasons: [season],
      isAdultContent: false,
    });
    return anime;
  };

  const createMockUserWithAnime = (anime: Anime) => {
    const user = User.create({
      imageUrl: 'https://example.com/avatar.jpg',
      username: 'testuser',
      email: 'test@example.com',
      password: 'Pass@123',
      biography: 'Test biography',
      role: 'user',
    });
    user.addAnimeToAnimeList(anime);
    return user;
  };

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    animeRepository = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UpdateSeasonStatusUseCase(userRepository, animeRepository);
  });

  it('deve atualizar o status de uma temporada com sucesso', async () => {
    const anime = createMockAnimeWithSeason();
    const user = createMockUserWithAnime(anime);
    const input = {
      userId: user.id.value,
      animeId: anime.id.value,
      season: {
        seasonNumber: 1,
        releaseDate: new Date('2002-10-03'),
        totalEpisodes: 220,
      },
      status: 'watching' as const,
      lastEpisodeWatched: 50,
      isLiked: true,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(anime);
    userRepository.update.mockImplementation(async (u) => u);

    const result = await useCase.execute(input);

    expect(userRepository.findById).toHaveBeenCalledWith(input.userId);
    expect(animeRepository.findById).toHaveBeenCalledWith(input.animeId);
    expect(userRepository.update).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('deve lançar NotFoundError quando o usuário não existir', async () => {
    const input = {
      userId: 'non-existent-user-id',
      animeId: 'some-anime-id',
      season: {
        seasonNumber: 1,
        releaseDate: new Date('2024-01-01'),
        totalEpisodes: 12,
      },
      status: 'watching' as const,
      lastEpisodeWatched: 1,
      isLiked: false,
    };

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    expect(animeRepository.findById).not.toHaveBeenCalled();
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('deve lançar NotFoundError quando o anime não existir', async () => {
    const anime = createMockAnimeWithSeason();
    const user = createMockUserWithAnime(anime);
    const input = {
      userId: user.id.value,
      animeId: 'non-existent-anime-id',
      season: {
        seasonNumber: 1,
        releaseDate: new Date('2024-01-01'),
        totalEpisodes: 12,
      },
      status: 'watching' as const,
      lastEpisodeWatched: 1,
      isLiked: false,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
