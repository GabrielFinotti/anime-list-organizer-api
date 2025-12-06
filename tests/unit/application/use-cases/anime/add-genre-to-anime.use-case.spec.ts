import { AddGenreToAnimeUseCase } from '../../../../../src/application/use-cases/anime/add-genre-to-anime.use-case.js';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository.js';
import { IGenreRepository } from '../../../../../src/domain/repositories/genre.repository.js';
import { NotFoundError } from '../../../../../src/application/errors/index.js';
import Anime from '../../../../../src/domain/entities/Anime.entity.js';
import Category from '../../../../../src/domain/entities/Category.entity.js';
import Genre from '../../../../../src/domain/entities/Genre.entity.js';
import Season from '../../../../../src/domain/value-objects/season.value-object.js';

describe('AddGenreToAnimeUseCase', () => {
  let useCase: AddGenreToAnimeUseCase;
  let animeRepository: jest.Mocked<IAnimeRepository>;
  let genreRepository: jest.Mocked<IGenreRepository>;

  const mockCategory = Category.create('Shounen', 'Shounen', 'Teens', 'Action anime for boys');

  const mockGenre = Genre.create('Action', 'Action-packed anime', false);

  const mockNewGenre = Genre.create('Adventure', 'Adventure anime', false);

  const createMockAnime = () =>
    Anime.create({
      imageUrl: 'https://example.com/naruto.jpg',
      name: 'Naruto',
      synopsis: 'A ninja anime',
      category: mockCategory,
      genres: [mockGenre],
      animeType: 'serie',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [],
      seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 })],
      isAdultContent: false,
    });

  beforeEach(() => {
    animeRepository = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    genreRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new AddGenreToAnimeUseCase(animeRepository, genreRepository);
  });

  it('deve adicionar um gênero ao anime com sucesso', async () => {
    const anime = createMockAnime();
    const input = {
      animeId: anime.id.value,
      genreId: mockNewGenre.id.value,
    };

    animeRepository.findById.mockResolvedValue(anime);
    genreRepository.findById.mockResolvedValue(mockNewGenre);
    animeRepository.update.mockImplementation(async (a) => a);

    const result = await useCase.execute(input);

    expect(animeRepository.findById).toHaveBeenCalledWith(input.animeId);
    expect(genreRepository.findById).toHaveBeenCalledWith(input.genreId);
    expect(animeRepository.update).toHaveBeenCalled();
    expect(result.genres).toHaveLength(2);
    expect(result.genres[1].name).toBe('adventure');
  });

  it('deve lançar NotFoundError quando o anime não existir', async () => {
    const input = {
      animeId: 'non-existent-anime-id',
      genreId: mockGenre.id.value,
    };

    animeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    expect(genreRepository.findById).not.toHaveBeenCalled();
    expect(animeRepository.update).not.toHaveBeenCalled();
  });

  it('deve lançar NotFoundError quando o gênero não existir', async () => {
    const anime = createMockAnime();
    const input = {
      animeId: anime.id.value,
      genreId: 'non-existent-genre-id',
    };

    animeRepository.findById.mockResolvedValue(anime);
    genreRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    expect(animeRepository.update).not.toHaveBeenCalled();
  });
});
