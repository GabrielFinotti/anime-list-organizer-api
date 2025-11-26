import Category from '../../../../src/domain/entities/Category.entity';
import Id from '../../../../src/domain/value-objects/id.value-object';
import Description from '../../../../src/domain/value-objects/description.value-object';

describe('Category Entity', () => {
  describe('create', () => {
    it('should create a Category with valid data', () => {
      const category = Category.create(
        'Action',
        'Animes with action-packed scenes and battle sequences',
      );

      expect(category.id).toBeDefined();
      expect(category.name.value).toBe('action');
      expect(category.description).toBeInstanceOf(Description);
      expect(category.description.value).toBe(
        'Animes with action-packed scenes and battle sequences',
      );
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate a new ULID when id is not provided', () => {
      const category1 = Category.create('Drama', 'Emotional and character-driven stories');
      const category2 = Category.create('Drama', 'Emotional and character-driven stories');

      expect(category1.id.value).not.toBe(category2.id.value);
    });

    // The Category.create signature was refactored to always generate an ID
    // so we no longer accept a provided id as argument — test removed

    it('should set createdAt and updatedAt to current time', () => {
      const beforeCreation = new Date();
      const category = Category.create('Romance', 'Love-centered anime stories');
      const afterCreation = new Date();

      expect(category.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(category.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
      expect(category.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(category.updatedAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('should throw error when description is not a string', () => {
      expect(() => Category.create('Thriller', 123 as any)).toThrow('Description must be a string');
    });

    it('should throw error when description is empty', () => {
      expect(() => Category.create('Horror', '')).toThrow(
        'Description must be between 10 and 800 characters',
      );
    });

    it('should throw error when description is whitespace only', () => {
      expect(() => Category.create('Fantasy', '   ')).toThrow(
        'Description must be between 10 and 800 characters',
      );
    });

    it('should throw error when description is less than 10 characters', () => {
      expect(() => Category.create('Sci-Fi', 'Too short')).toThrow(
        'Description must be between 10 and 800 characters',
      );
    });
  });

  describe('getters', () => {
    let category: Category;

    beforeEach(() => {
      category = Category.create(
        'Slice of Life',
        'Daily life stories with minimal conflict and drama',
      );
    });

    it('should return id through getter', () => {
      expect(category.id).toBeInstanceOf(Id);
      expect(typeof category.id.value).toBe('string');
    });

    it('should return name through getter', () => {
      expect(category.name.value).toBe('slice of life');
    });

    it('should return description through getter', () => {
      expect(category.description).toBeInstanceOf(Description);
      expect(category.description.value).toBe('Daily life stories with minimal conflict and drama');
    });

    it('should return createdAt through getter', () => {
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt through getter', () => {
      expect(category.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('immutability', () => {
    it('should not allow modification of properties', () => {
      const category = Category.create('Mystery', 'Suspenseful and mysterious storylines');

      expect(() => {
        (category as any).description = 'Modified description';
      }).toThrow();
    });
  });

  describe('toDomain', () => {
    it('should reconstruct a Category from a persistence-like object', () => {
      const original = Category.create('Adventure', 'Explorative and journey focused');

      const doc = {
        id: original.id.value,
        name: original.name.value,
        description: original.description.value,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt,
      } as any;

      const reconstructed = Category.toDomain(doc);

      expect(reconstructed).toBeDefined();
      expect(reconstructed.id.value).toBe(original.id.value);
      expect(reconstructed.name.value).toBe(original.name.value);
      expect(reconstructed.description.value).toBe(original.description.value);
      expect(reconstructed.createdAt.getTime()).toBe(original.createdAt.getTime());
      expect(reconstructed.updatedAt.getTime()).toBe(original.updatedAt.getTime());
    });
  });
});
