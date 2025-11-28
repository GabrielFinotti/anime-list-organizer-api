import { AddMovieToAnimeUseCase } from '../../../../../src/application/use-cases/anime/add-movie-to-anime.use-case.js';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository.js';
import { NotFoundError } from '../../../../../src/application/errors/index.js';
import Anime from '../../../../../src/domain/entities/Anime.entity.js';
import Category from '../../../../../src/domain/entities/Category.entity.js';
import Genre from '../../../../../src/domain/entities/Genre.entity.js';
import Season from '../../../../../src/domain/value-objects/season.value-object.js';
import Movie from '../../../../../src/domain/value-objects/movie.value-object.js';

describe('AddMovieToAnimeUseCase', () => {
  let useCase: AddMovieToAnimeUseCase;
  let animeRepository: jest.Mocked<IAnimeRepository>;

  const mockCategory = Category.create('Shounen', 'Action anime for boys');
  const mockGenre = Genre.create('Action', 'Action genre', false);

  const createMockAnime = () =>
    Anime.create({
      imageUrl: 'https://example.com/naruto.jpg',
      name: 'Naruto',
      synopsis: 'A ninja anime',
      category: mockCategory,
      genres: [mockGenre],
      animeType: 'mixed',
      productionType: 'original',
      movies: [Movie.create({ name: 'Naruto: First Movie', releaseDate: new Date('2002-01-01') })],
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

    useCase = new AddMovieToAnimeUseCase(animeRepository);
  });

  it('deve adicionar um filme ao anime com sucesso', async () => {
    const anime = createMockAnime();
    const movieData = {
      animeId: anime.id.value,
      name: 'Naruto: The Movie',
      releaseDate: new Date('2004-08-21'),
    };

    animeRepository.findById.mockResolvedValue(anime);
    animeRepository.update.mockImplementation(async (a) => a);

    const result = await useCase.execute(movieData);

    expect(animeRepository.findById).toHaveBeenCalledWith(movieData.animeId);
    expect(animeRepository.update).toHaveBeenCalled();
    expect(result.movies).toHaveLength(2);
    expect(result.movies[1].title).toBe('naruto: the movie');
  });

  it('deve lançar NotFoundError quando o anime não existir', async () => {
    const movieData = {
      animeId: 'non-existent-id',
      name: 'Some Movie',
      releaseDate: new Date('2024-01-01'),
    };

    animeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(movieData)).rejects.toThrow(NotFoundError);
    expect(animeRepository.update).not.toHaveBeenCalled();
  });
});
