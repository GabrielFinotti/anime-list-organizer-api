import { CreateGenreUseCase } from '../../../../../src/application/use-cases/genre/create-genre.use-case';
import { IGenreRepository } from '../../../../../src/domain/repositories/genre.repository';
import Genre from '../../../../../src/domain/entities/Genre.entity';
import { ConflictError } from '../../../../../src/application/errors';

describe('CreateGenreUseCase', () => {
  let useCase: CreateGenreUseCase;
  let mockGenreRepository: jest.Mocked<IGenreRepository>;

  beforeEach(() => {
    mockGenreRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateGenreUseCase(mockGenreRepository);
  });

  it('should create a genre successfully', async () => {
    const input = {
      name: 'Action',
      description: 'Action genre description',
      isAdultContent: false,
    };

    mockGenreRepository.findByName.mockResolvedValue(null);
    mockGenreRepository.create.mockResolvedValue();

    const result = await useCase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(input.name.toLowerCase());
    expect(result.description).toBe(input.description);
    expect(result.isAdultContent).toBe(false);
    expect(mockGenreRepository.findByName).toHaveBeenCalledWith(input.name.toLowerCase());
    expect(mockGenreRepository.create).toHaveBeenCalled();
  });

  it('should create an adult content genre', async () => {
    const input = {
      name: 'Ecchi',
      description: 'Ecchi genre description',
      isAdultContent: true,
    };

    mockGenreRepository.findByName.mockResolvedValue(null);
    mockGenreRepository.create.mockResolvedValue();

    const result = await useCase.execute(input);

    expect(result.isAdultContent).toBe(true);
  });

  it('should throw ConflictError when genre name already exists', async () => {
    const input = {
      name: 'Action',
      description: 'Action genre description',
      isAdultContent: false,
    };

    const existingGenre = Genre.create('Action', 'Existing description', false);
    mockGenreRepository.findByName.mockResolvedValue(existingGenre);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
    await expect(useCase.execute(input)).rejects.toThrow("Genre with name 'action' already exists");
    expect(mockGenreRepository.create).not.toHaveBeenCalled();
  });
});
