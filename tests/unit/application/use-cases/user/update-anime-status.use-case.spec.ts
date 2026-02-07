import { UpdateAnimeStatusUseCase } from '../../../../../src/application/use-cases/user/update-anime-status.use-case';
import { IUserRepository } from '../../../../../src/domain/repositories/user.repository';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository';
import { NotFoundError } from '../../../../../src/application/errors/index';
import User from '../../../../../src/domain/entities/User.entity';
import Anime from '../../../../../src/domain/entities/Anime.entity';
import Category from '../../../../../src/domain/entities/Category.entity';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import Movie from '../../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../../src/domain/value-objects/season.value-object';
import MovieStatus from '../../../../../src/domain/value-objects/movieStatus.value-object';
import SeasonStatus from '../../../../../src/domain/value-objects/seasonStatus.value-object';
import { BusinessRuleError } from '../../../../../src/domain/errors/index';

describe('UpdateAnimeStatusUseCase', () => {
  let useCase: UpdateAnimeStatusUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let animeRepository: jest.Mocked<IAnimeRepository>;

  const mockCategory = Category.create('Shounen', 'Shounen', 'Young Male', 'Action anime for boys');
  const mockGenre = Genre.create('Action', 'Action genre', false);

  const createMockAnime = () => {
    const movie = Movie.create({
      name: 'Naruto: The Movie',
      releaseDate: new Date('2004-08-21'),
    });
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
      animeType: 'mixed',
      productionType: 'original',
      typeOfMaterialOrigin: 'manga',
      movies: [movie],
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

    useCase = new UpdateAnimeStatusUseCase(userRepository, animeRepository);
  });

  it('deve atualizar o status do anime para watching com sucesso', async () => {
    const anime = createMockAnime();
    const user = createMockUserWithAnime(anime);
    const input = {
      userId: user.id.value,
      animeId: anime.id.value,
      status: 'watching' as const,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(anime);
    userRepository.update.mockImplementation(async (u) => u);

    const result = await useCase.execute(input);

    expect(userRepository.findById).toHaveBeenCalledWith(input.userId);
    expect(animeRepository.findById).toHaveBeenCalledWith(input.animeId);
    expect(userRepository.update).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.animeList.list[0].status).toBe('watching');
  });

  it('deve atualizar o status do anime para dropped com sucesso', async () => {
    const anime = createMockAnime();
    const user = createMockUserWithAnime(anime);
    const input = {
      userId: user.id.value,
      animeId: anime.id.value,
      status: 'dropped' as const,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(anime);
    userRepository.update.mockImplementation(async (u) => u);

    const result = await useCase.execute(input);

    expect(result.animeList.list[0].status).toBe('dropped');
  });

  it('deve atualizar o status do anime para finished quando todos sub-status estão finalizados', async () => {
    const anime = createMockAnime();
    const user = createMockUserWithAnime(anime);

    // Finalizar movie e season antes de marcar anime como finished
    const movie = anime.movies[0];
    const finishedMovieStatus = MovieStatus.create({ movie, status: 'finished', isLiked: false });
    user.updateMovieStatus(anime, finishedMovieStatus);

    const season = anime.seasons[0];
    const finishedSeasonStatus = SeasonStatus.create({
      season,
      status: 'finished',
      lastEpisodeWatched: 220,
      isLiked: false,
    });
    user.updateSeasonStatus(anime, finishedSeasonStatus);

    const input = {
      userId: user.id.value,
      animeId: anime.id.value,
      status: 'finished' as const,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(anime);
    userRepository.update.mockImplementation(async (u) => u);

    const result = await useCase.execute(input);

    expect(result.animeList.list[0].status).toBe('finished');
  });

  it('deve lançar erro ao tentar marcar anime como finished com sub-status não finalizados', async () => {
    const anime = createMockAnime();
    const user = createMockUserWithAnime(anime);
    const input = {
      userId: user.id.value,
      animeId: anime.id.value,
      status: 'finished' as const,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(anime);

    await expect(useCase.execute(input)).rejects.toThrow(BusinessRuleError);
    await expect(useCase.execute(input)).rejects.toThrow(
      'animeList: anime cannot be marked as finished while it has movies or seasons that are not finished',
    );
  });

  it('deve lançar NotFoundError quando usuário não existe', async () => {
    const input = {
      userId: 'non-existent-id',
      animeId: 'any-anime-id',
      status: 'watching' as const,
    };

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
  });

  it('deve lançar NotFoundError quando anime não existe', async () => {
    const anime = createMockAnime();
    const user = createMockUserWithAnime(anime);
    const input = {
      userId: user.id.value,
      animeId: 'non-existent-anime-id',
      status: 'watching' as const,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
  });

  it('deve lançar BusinessRuleError quando anime não está na lista do usuário', async () => {
    const anime = createMockAnime();
    const user = User.create({
      imageUrl: 'https://example.com/avatar.jpg',
      username: 'testuser',
      email: 'test@example.com',
      password: 'Pass@123',
      biography: 'Test biography',
      role: 'user',
    });
    // Usuário não tem o anime na lista

    const input = {
      userId: user.id.value,
      animeId: anime.id.value,
      status: 'watching' as const,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(anime);

    await expect(useCase.execute(input)).rejects.toThrow(BusinessRuleError);
    await expect(useCase.execute(input)).rejects.toThrow('animeList: anime not found in list');
  });
});
