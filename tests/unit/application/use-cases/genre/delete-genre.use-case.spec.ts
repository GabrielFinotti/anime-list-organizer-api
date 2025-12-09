import { DeleteGenreUseCase } from '../../../../../src/application/use-cases/genre/delete-genre.use-case';
import { IGenreRepository } from '../../../../../src/domain/repositories/genre.repository';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import { NotFoundError } from '../../../../../src/application/errors';

describe('DeleteGenreUseCase', () => {
  let useCase: DeleteGenreUseCase;
  let mockGenreRepository: jest.Mocked<IGenreRepository>;

  beforeEach(() => {
    mockGenreRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteGenreUseCase(mockGenreRepository);
  });

  it('should delete a genre successfully', async () => {
    const genre = Genre.create('Action', 'Action description', false);
    mockGenreRepository.findById.mockResolvedValue(genre);
    mockGenreRepository.delete.mockResolvedValue();

    await useCase.execute(genre.id.value);

    expect(mockGenreRepository.findById).toHaveBeenCalledWith(genre.id.value);
    expect(mockGenreRepository.delete).toHaveBeenCalledWith(genre.id.value);
  });

  it('should throw NotFoundError when genre not found', async () => {
    const genreId = 'non-existent-id';
    mockGenreRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(genreId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(genreId)).rejects.toThrow(
      `Genre with identifier '${genreId}' not found`,
    );
    expect(mockGenreRepository.delete).not.toHaveBeenCalled();
  });
});
