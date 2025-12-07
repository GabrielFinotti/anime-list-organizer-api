import Category from '../../../../src/domain/entities/Category.entity';
import CategoryPersistenceMapper, {
  CategoryDocument,
} from '../../../../src/infrastructure/mappers/category.persistence-mapper';

describe('CategoryPersistenceMapper', () => {
  const validId = '01KB3H4ZMD9J0NT3JQG8XTXWN0';
  const now = new Date();

  describe('toPersistence', () => {
    it('should convert domain entity to persistence document', () => {
      const category = Category.create('Shonen', 'Shounen', 'Young Male', 'Anime for young boys');

      const document = CategoryPersistenceMapper.toPersistence(category);

      expect(document._id).toBe(category.id.value);
      expect(document.name).toBe(category.name.value);
      expect(document.description).toBe(category.description.value);
      expect(document.createdAt).toBe(category.createdAt);
      expect(document.updatedAt).toBe(category.updatedAt);
    });

    it('should normalize name to lowercase', () => {
      const category = Category.create('SEINEN', 'Seinen', 'Adult Male', 'Anime for adult men');

      const document = CategoryPersistenceMapper.toPersistence(category);

      expect(document.name).toBe('seinen');
    });
  });

  describe('toDomain', () => {
    it('should convert persistence document to domain entity', () => {
      const doc: CategoryDocument = {
        _id: validId,
        name: 'shoujo',
        translatedName: 'Shoujo',
        targetAudience: 'Young Female',
        description: 'Anime for young girls',
        createdAt: now,
        updatedAt: now,
      };

      const category = CategoryPersistenceMapper.toDomain(doc);

      expect(category.id.value).toBe(validId);
      expect(category.name.value).toBe('shoujo');
      expect(category.description.value).toBe('Anime for young girls');
      expect(category.createdAt).toEqual(now);
      expect(category.updatedAt).toEqual(now);
    });

    it('should handle different category types', () => {
      const doc: CategoryDocument = {
        _id: validId,
        name: 'josei',
        translatedName: 'Josei',
        targetAudience: 'Adult Female',
        description: 'Anime for adult women audience',
        createdAt: now,
        updatedAt: now,
      };

      const category = CategoryPersistenceMapper.toDomain(doc);

      expect(category.name.value).toBe('josei');
      expect(category.description.value).toBe('Anime for adult women audience');
    });
  });

  describe('round-trip conversion', () => {
    it('should preserve data through toPersistence -> toDomain cycle', () => {
      const originalCategory = Category.create(
        'Kodomo',
        'Kodomo',
        'Children',
        'Anime for children audiences',
      );

      const document = CategoryPersistenceMapper.toPersistence(originalCategory);
      const reconstructedCategory = CategoryPersistenceMapper.toDomain(document);

      expect(reconstructedCategory.id.value).toBe(originalCategory.id.value);
      expect(reconstructedCategory.name.value).toBe(originalCategory.name.value);
      expect(reconstructedCategory.description.value).toBe(originalCategory.description.value);
    });

    it('should preserve data through toDomain -> toPersistence cycle', () => {
      const originalDoc: CategoryDocument = {
        _id: validId,
        name: 'isekai',
        translatedName: 'Isekai',
        targetAudience: 'General',
        description: 'Another world transportation genre',
        createdAt: now,
        updatedAt: now,
      };

      const category = CategoryPersistenceMapper.toDomain(originalDoc);
      const reconstructedDoc = CategoryPersistenceMapper.toPersistence(category);

      expect(reconstructedDoc._id).toBe(originalDoc._id);
      expect(reconstructedDoc.name).toBe(originalDoc.name);
      expect(reconstructedDoc.description).toBe(originalDoc.description);
    });
  });
});
