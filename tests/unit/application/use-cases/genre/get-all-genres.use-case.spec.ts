import { GetAllGenresUseCase } from '../../../../../src/application/use-cases/genre/get-all-genres.use-case';
import { IGenreRepository } from '../../../../../src/domain/repositories/genre.repository';
import Genre from '../../../../../src/domain/entities/Genre.entity';

describe('GetAllGenresUseCase', () => {
  let useCase: GetAllGenresUseCase;
  let mockGenreRepository: jest.Mocked<IGenreRepository>;

  beforeEach(() => {
    mockGenreRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetAllGenresUseCase(mockGenreRepository);
  });

  it('should return all genres', async () => {
    const genres = [
      Genre.create('Action', 'Action description', false),
      Genre.create('Comedy', 'Comedy description', false),
      Genre.create('Ecchi', 'Ecchi description', true),
    ];

    mockGenreRepository.findAll.mockResolvedValue(genres);

    const result = await useCase.execute();

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('action');
    expect(result[1].name).toBe('comedy');
    expect(result[2].name).toBe('ecchi');
    expect(result[2].isAdultContent).toBe(true);
    expect(mockGenreRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no genres exist', async () => {
    mockGenreRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});
