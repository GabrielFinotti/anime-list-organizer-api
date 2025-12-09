import { GetGenreByIdUseCase } from '../../../../../src/application/use-cases/genre/get-genre-by-id.use-case';
import { IGenreRepository } from '../../../../../src/domain/repositories/genre.repository';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import { NotFoundError } from '../../../../../src/application/errors';

describe('GetGenreByIdUseCase', () => {
  let useCase: GetGenreByIdUseCase;
  let mockGenreRepository: jest.Mocked<IGenreRepository>;

  beforeEach(() => {
    mockGenreRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetGenreByIdUseCase(mockGenreRepository);
  });

  it('should return a genre when found', async () => {
    const genre = Genre.create('Action', 'Action description', false);
    mockGenreRepository.findById.mockResolvedValue(genre);

    const result = await useCase.execute(genre.id.value);

    expect(result.id).toBe(genre.id.value);
    expect(result.name).toBe('action');
    expect(result.description).toBe('Action description');
    expect(result.isAdultContent).toBe(false);
    expect(mockGenreRepository.findById).toHaveBeenCalledWith(genre.id.value);
  });

  it('should throw NotFoundError when genre not found', async () => {
    const genreId = 'non-existent-id';
    mockGenreRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(genreId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(genreId)).rejects.toThrow(
      `Genre with identifier '${genreId}' not found`,
    );
  });
});
