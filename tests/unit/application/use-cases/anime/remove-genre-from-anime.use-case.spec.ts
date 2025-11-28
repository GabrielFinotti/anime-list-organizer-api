import { RemoveGenreFromAnimeUseCase } from '../../../../../src/application/use-cases/anime/remove-genre-from-anime.use-case.js';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository.js';
import { NotFoundError } from '../../../../../src/application/errors/index.js';
import Anime from '../../../../../src/domain/entities/Anime.entity.js';
import Category from '../../../../../src/domain/entities/Category.entity.js';
import Genre from '../../../../../src/domain/entities/Genre.entity.js';
import Season from '../../../../../src/domain/value-objects/season.value-object.js';

describe('RemoveGenreFromAnimeUseCase', () => {
  let useCase: RemoveGenreFromAnimeUseCase;
  let animeRepository: jest.Mocked<IAnimeRepository>;

  const mockCategory = Category.create('Shounen', 'Action anime for boys');

  const mockGenre = Genre.create('Action', 'Action-packed anime', false);
  const mockGenre2 = Genre.create('Adventure', 'Adventure anime', false);

  const createMockAnimeWithGenre = () => {
    const anime = Anime.create({
      imageUrl: 'https://example.com/naruto.jpg',
      name: 'Naruto',
      synopsis: 'A ninja anime',
      category: mockCategory,
      genres: [mockGenre, mockGenre2],
      animeType: 'serie',
      productionType: 'original',
      movies: [],
      seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 })],
      isAdultContent: false,
    });
    return anime;
  };

  beforeEach(() => {
    animeRepository = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new RemoveGenreFromAnimeUseCase(animeRepository);
  });

  it('deve remover um gênero do anime com sucesso', async () => {
    const anime = createMockAnimeWithGenre();
    const input = {
      animeId: anime.id.value,
      genreId: mockGenre.id.value,
    };

    animeRepository.findById.mockResolvedValue(anime);
    animeRepository.update.mockImplementation(async (a) => a);

    const result = await useCase.execute(input);

    expect(animeRepository.findById).toHaveBeenCalledWith(input.animeId);
    expect(animeRepository.update).toHaveBeenCalled();
    expect(result.genres).toHaveLength(1);
  });

  it('deve lançar NotFoundError quando o anime não existir', async () => {
    const input = {
      animeId: 'non-existent-anime-id',
      genreId: mockGenre.id.value,
    };

    animeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    expect(animeRepository.update).not.toHaveBeenCalled();
  });
});
