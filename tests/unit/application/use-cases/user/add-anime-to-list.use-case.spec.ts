import { AddAnimeToListUseCase } from '../../../../../src/application/use-cases/user/add-anime-to-list.use-case.js';
import { IUserRepository } from '../../../../../src/domain/repositories/user.repository.js';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository.js';
import { NotFoundError } from '../../../../../src/application/errors/index.js';
import User from '../../../../../src/domain/entities/User.entity.js';
import Anime from '../../../../../src/domain/entities/Anime.entity.js';
import Category from '../../../../../src/domain/entities/Category.entity.js';
import Genre from '../../../../../src/domain/entities/Genre.entity.js';
import Season from '../../../../../src/domain/value-objects/season.value-object.js';

describe('AddAnimeToListUseCase', () => {
  let useCase: AddAnimeToListUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let animeRepository: jest.Mocked<IAnimeRepository>;

  const createMockUser = () =>
    User.create({
      imageUrl: 'https://example.com/avatar.jpg',
      username: 'testuser',
      email: 'test@example.com',
      password: 'Pass@123',
      biography: 'Test biography',
      role: 'user',
    });

  const mockCategory = Category.create('Shounen', 'Shounen', 'Young Male', 'Action anime for boys');
  const mockGenre = Genre.create('Action', 'Action genre', false);

  const createMockAnime = () =>
    Anime.create({
      imageUrl: 'https://example.com/naruto.jpg',
      name: 'Naruto',
      synopsis: 'A ninja anime',
      category: mockCategory,
      genres: [mockGenre],
      animeType: 'serie',
      productionType: 'original',
      typeOfMaterialOrigin: 'manga',
      movies: [],
      seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 })],
      isAdultContent: false,
    });

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

    useCase = new AddAnimeToListUseCase(userRepository, animeRepository);
  });

  it('deve adicionar um anime à lista do usuário com sucesso', async () => {
    const user = createMockUser();
    const anime = createMockAnime();
    const input = {
      userId: user.id.value,
      animeId: anime.id.value,
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(anime);
    userRepository.update.mockImplementation(async (u) => u);

    const result = await useCase.execute(input);

    expect(userRepository.findById).toHaveBeenCalledWith(input.userId);
    expect(animeRepository.findById).toHaveBeenCalledWith(input.animeId);
    expect(userRepository.update).toHaveBeenCalled();
    expect(result.animeList.list).toHaveLength(1);
  });

  it('deve lançar NotFoundError quando o usuário não existir', async () => {
    const input = {
      userId: 'non-existent-user-id',
      animeId: 'some-anime-id',
    };

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    expect(animeRepository.findById).not.toHaveBeenCalled();
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('deve lançar NotFoundError quando o anime não existir', async () => {
    const user = createMockUser();
    const input = {
      userId: user.id.value,
      animeId: 'non-existent-anime-id',
    };

    userRepository.findById.mockResolvedValue(user);
    animeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
