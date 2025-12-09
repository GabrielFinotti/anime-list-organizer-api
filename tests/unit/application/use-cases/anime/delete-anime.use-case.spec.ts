import { DeleteAnimeUseCase } from '../../../../../src/application/use-cases/anime/delete-anime.use-case';
import { IAnimeRepository } from '../../../../../src/domain/repositories/anime.repository';
import { IR2Service } from '../../../../../src/application/services/r2.service';
import Anime from '../../../../../src/domain/entities/Anime.entity';
import Category from '../../../../../src/domain/entities/Category.entity';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import Season from '../../../../../src/domain/value-objects/season.value-object';
import { NotFoundError } from '../../../../../src/application/errors';

describe('DeleteAnimeUseCase', () => {
  let useCase: DeleteAnimeUseCase;
  let mockAnimeRepository: jest.Mocked<IAnimeRepository>;
  let mockR2Service: jest.Mocked<IR2Service>;

  beforeEach(() => {
    mockAnimeRepository = {
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockR2Service = {
      uploadObject: jest.fn(),
      updateObject: jest.fn(),
      deleteObject: jest.fn(),
    };

    useCase = new DeleteAnimeUseCase(mockAnimeRepository, mockR2Service);
  });

  it('should delete an anime successfully', async () => {
    const category = Category.create('Shounen', 'Shounen', 'Teens', 'Shounen description');
    const genre = Genre.create('Action', 'Action description', false);

    const anime = Anime.create({
      imageUrl: 'https://example.com/image.jpg',
      name: 'Naruto',
      synopsis: 'A ninja story',
      category,
      genres: [genre],
      animeType: 'serie',
      productionType: 'adaptation',
      typeOfMaterialOrigin: 'manga',
      movies: [],
      seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 220 })],
      isAdultContent: false,
    });

    mockAnimeRepository.findById.mockResolvedValue(anime);
    mockR2Service.deleteObject.mockResolvedValue();
    mockAnimeRepository.delete.mockResolvedValue();

    await useCase.execute(anime.id.value);

    expect(mockAnimeRepository.findById).toHaveBeenCalledWith(anime.id.value);
    expect(mockR2Service.deleteObject).toHaveBeenCalledWith(`animes/${anime.id.value}/naruto.webp`);
    expect(mockAnimeRepository.delete).toHaveBeenCalledWith(anime.id.value);
  });

  it('should throw NotFoundError when anime not found', async () => {
    const animeId = 'non-existent-id';
    mockAnimeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(animeId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(animeId)).rejects.toThrow(
      `Anime with identifier '${animeId}' not found`,
    );
    expect(mockR2Service.deleteObject).not.toHaveBeenCalled();
    expect(mockAnimeRepository.delete).not.toHaveBeenCalled();
  });

  it('should delete anime with special characters in name', async () => {
    const category = Category.create('Shounen', 'Shounen', 'Teens', 'Shounen description');
    const genre = Genre.create('Action', 'Action description', false);

    const anime = Anime.create({
      imageUrl: 'https://example.com/image.jpg',
      name: 'Shingeki no Kyojin',
      synopsis: 'A story about titans',
      category,
      genres: [genre],
      animeType: 'serie',
      productionType: 'adaptation',
      typeOfMaterialOrigin: 'manga',
      movies: [],
      seasons: [Season.create({ seasonNumber: 1, releaseDate: new Date(), totalEpisodes: 25 })],
      isAdultContent: false,
    });

    mockAnimeRepository.findById.mockResolvedValue(anime);
    mockR2Service.deleteObject.mockResolvedValue();
    mockAnimeRepository.delete.mockResolvedValue();

    await useCase.execute(anime.id.value);

    expect(mockR2Service.deleteObject).toHaveBeenCalledWith(
      `animes/${anime.id.value}/shingeki-no-kyojin.webp`,
    );
  });
});
