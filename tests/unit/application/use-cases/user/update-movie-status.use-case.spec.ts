import { UpdateMovieStatusUseCase } from '../../../../../src/application/use-cases/user/update-movie-status.use-case.js';
import { IUserRepository } from '../../../../../src/domain/repositories/user.repository.js';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository.js';
import { NotFoundError } from '../../../../../src/application/errors/index.js';
import User from '../../../../../src/domain/entities/User.entity.js';
import Anime from '../../../../../src/domain/entities/Anime.entity.js';
import Category from '../../../../../src/domain/entities/Category.entity.js';
import Genre from '../../../../../src/domain/entities/Genre.entity.js';
import Movie from '../../../../../src/domain/value-objects/movie.value-object.js';
import Season from '../../../../../src/domain/value-objects/season.value-object.js';

describe('UpdateMovieStatusUseCase', () => {
  let useCase: UpdateMovieStatusUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let animeRepository: jest.Mocked<IAnimeRepository>;

  const mockCategory = Category.create('Shounen', 'Shounen', 'Young Male', 'Action anime for boys');
  const mockGenre = Genre.create('Action', 'Action genre', false);

  const createMockAnimeWithMovie = () => {
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

    useCase = new UpdateMovieStatusUseCase(userRepository, animeRepository);
  });

  it('deve atualizar o status de um filme com sucesso', async () => {
    const anime = createMockAnimeWithMovie();
    const user = createMockUserWithAnime(anime);
    const input = {
      userId: user.id.value,
      animeId: anime.id.value,
      movie: {
        name: 'Naruto: The Movie',
        releaseDate: new Date('2004-08-21'),
      },
      status: 'finished' as const,
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
      movie: {
        name: 'Some Movie',
        releaseDate: new Date('2024-01-01'),
      },
      status: 'finished' as const,
      isLiked: false,
    };

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    expect(animeRepository.findById).not.toHaveBeenCalled();
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('deve lançar NotFoundError quando o anime não existir', async () => {
    const anime = createMockAnimeWithMovie();
    const user = createMockUserWithAnime(anime);
    const input = {
      userId: user.id.value,
      animeId: 'non-existent-anime-id',
      movie: {
        name: 'Some Movie',
        releaseDate: new Date('2024-01-01'),
      },
      status: 'finished' as const,
      isLiked: false,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
