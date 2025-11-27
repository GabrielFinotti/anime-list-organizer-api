import Genre from '../../../../src/domain/entities/Genre.entity';
import GenrePersistenceMapper, {
  GenreDocument,
} from '../../../../src/infrastructure/mappers/genre.persistence-mapper';

describe('GenrePersistenceMapper', () => {
  const validId = '01KB3H4ZMD9J0NT3JQG8XTXWN0';
  const now = new Date();

  describe('toPersistence', () => {
    it('should convert domain entity to persistence document', () => {
      const genre = Genre.create('Action', 'Action packed adventures', false);

      const document = GenrePersistenceMapper.toPersistence(genre);

      expect(document._id).toBe(genre.id.value);
      expect(document.name).toBe(genre.name.value);
      expect(document.description).toBe(genre.description.value);
      expect(document.isAdultContent).toBe(genre.isAdultContent);
      expect(document.createdAt).toBe(genre.createdAt);
      expect(document.updatedAt).toBe(genre.updatedAt);
    });

    it('should preserve all genre properties in document', () => {
      const genre = Genre.create('Horror', 'Scary and thrilling stories', true);

      const document = GenrePersistenceMapper.toPersistence(genre);

      expect(document.isAdultContent).toBe(true);
      expect(document.name).toBe('horror');
      expect(document.description).toBe('Scary and thrilling stories');
    });
  });

  describe('toDomain', () => {
    it('should convert persistence document to domain entity', () => {
      const doc: GenreDocument = {
        _id: validId,
        name: 'comedy',
        description: 'Funny and humorous content',
        isAdultContent: false,
        createdAt: now,
        updatedAt: now,
      };

      const genre = GenrePersistenceMapper.toDomain(doc);

      expect(genre.id.value).toBe(validId);
      expect(genre.name.value).toBe('comedy');
      expect(genre.description.value).toBe('Funny and humorous content');
      expect(genre.isAdultContent).toBe(false);
      expect(genre.createdAt).toEqual(now);
      expect(genre.updatedAt).toEqual(now);
    });

    it('should handle adult content genre', () => {
      const doc: GenreDocument = {
        _id: validId,
        name: 'ecchi',
        description: 'Adult oriented anime content',
        isAdultContent: true,
        createdAt: now,
        updatedAt: now,
      };

      const genre = GenrePersistenceMapper.toDomain(doc);

      expect(genre.isAdultContent).toBe(true);
    });
  });

  describe('round-trip conversion', () => {
    it('should preserve data through toPersistence -> toDomain cycle', () => {
      const originalGenre = Genre.create(
        'Romance',
        'Love stories and relationships',
        false,
      );

      const document = GenrePersistenceMapper.toPersistence(originalGenre);
      const reconstructedGenre = GenrePersistenceMapper.toDomain(document);

      expect(reconstructedGenre.id.value).toBe(originalGenre.id.value);
      expect(reconstructedGenre.name.value).toBe(originalGenre.name.value);
      expect(reconstructedGenre.description.value).toBe(
        originalGenre.description.value,
      );
      expect(reconstructedGenre.isAdultContent).toBe(
        originalGenre.isAdultContent,
      );
    });

    it('should preserve data through toDomain -> toPersistence cycle', () => {
      const originalDoc: GenreDocument = {
        _id: validId,
        name: 'fantasy',
        description: 'Magical and fantastical worlds',
        isAdultContent: false,
        createdAt: now,
        updatedAt: now,
      };

      const genre = GenrePersistenceMapper.toDomain(originalDoc);
      const reconstructedDoc = GenrePersistenceMapper.toPersistence(genre);

      expect(reconstructedDoc._id).toBe(originalDoc._id);
      expect(reconstructedDoc.name).toBe(originalDoc.name);
      expect(reconstructedDoc.description).toBe(originalDoc.description);
      expect(reconstructedDoc.isAdultContent).toBe(originalDoc.isAdultContent);
    });
  });
});
