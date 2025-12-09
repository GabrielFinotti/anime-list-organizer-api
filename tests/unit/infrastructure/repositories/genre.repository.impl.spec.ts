import Genre from '../../../../src/domain/entities/Genre.entity';
import GenreRepositoryImpl from '../../../../src/infrastructure/repositories/genre.repository.impl';
import GenreModel from '../../../../src/infrastructure/database/models/genre.model';
import GenrePersistenceMapper from '../../../../src/infrastructure/mappers/genre.persistence-mapper';

jest.mock('../../../../src/infrastructure/database/models/genre.model');

describe('GenreRepositoryImpl', () => {
  let repository: GenreRepositoryImpl;
  const mockGenreDoc = {
    _id: '01KB3H4ZMD9J0NT3JQG8XTXWN0',
    name: 'action',
    description: 'Action-packed anime with exciting battles',
    isAdultContent: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new GenreRepositoryImpl();
  });

  describe('findById', () => {
    it('should return a genre when found', async () => {
      (GenreModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockGenreDoc),
      });

      const result = await repository.findById(mockGenreDoc._id);

      expect(GenreModel.findById).toHaveBeenCalledWith(mockGenreDoc._id);
      expect(result).not.toBeNull();
      expect(result?.id.value).toBe(mockGenreDoc._id);
      expect(result?.name.value).toBe(mockGenreDoc.name);
    });

    it('should return null when genre not found', async () => {
      (GenreModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return a genre when found by name', async () => {
      (GenreModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockGenreDoc),
      });

      const result = await repository.findByName('action');

      expect(GenreModel.findOne).toHaveBeenCalledWith({ name: 'action' });
      expect(result).not.toBeNull();
      expect(result?.name.value).toBe(mockGenreDoc.name);
    });

    it('should return null when genre not found by name', async () => {
      (GenreModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findByName('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all genres', async () => {
      const mockGenreDocs = [
        mockGenreDoc,
        {
          ...mockGenreDoc,
          _id: '01KB3H4ZMG6MV4JQFN89N03J4G',
          name: 'comedy',
          description: 'Funny and lighthearted anime content',
        },
      ];

      (GenreModel.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockGenreDocs),
      });

      const result = await repository.findAll();

      expect(GenreModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].name.value).toBe('action');
      expect(result[1].name.value).toBe('comedy');
    });

    it('should return empty array when no genres exist', async () => {
      (GenreModel.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      });

      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create a genre successfully', async () => {
      const genre = Genre.create('Action', 'Action-packed anime with exciting battles', false);

      (GenreModel.create as jest.Mock).mockResolvedValue(mockGenreDoc);

      await repository.create(genre);

      expect(GenreModel.create).toHaveBeenCalledWith(GenrePersistenceMapper.toPersistence(genre));
    });
  });

  describe('delete', () => {
    it('should delete a genre by id', async () => {
      (GenreModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockGenreDoc);

      await repository.delete(mockGenreDoc._id);

      expect(GenreModel.findByIdAndDelete).toHaveBeenCalledWith(mockGenreDoc._id);
    });
  });
});
