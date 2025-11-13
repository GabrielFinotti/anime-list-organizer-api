import Genre from '../../../../src/domain/entities/Genre.entity';
import Id from '../../../../src/domain/value-objects/id.value-object';

describe('Genre Entity', () => {
  describe('create', () => {
    it('should create a Genre with valid data', () => {
      const genre = Genre.create(
        'Action',
        'Animes with action-packed scenes and battle sequences',
        false,
      );

      expect(genre.id).toBeDefined();
      expect(genre.name.value).toBe('action');
      expect(genre.description).toBe('Animes with action-packed scenes and battle sequences');
      expect(genre.isAdultContent).toBe(false);
      expect(genre.createdAt).toBeInstanceOf(Date);
      expect(genre.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate a new ULID when created multiple times', () => {
      const genre1 = Genre.create('Drama', 'Emotional and character-driven stories', false);
      const genre2 = Genre.create('Drama', 'Emotional and character-driven stories', false);

      expect(genre1.id.value).not.toBe(genre2.id.value);
    });

    it('should set createdAt and updatedAt to current time', () => {
      const beforeCreation = new Date();
      const genre = Genre.create('Romance', 'Love-centered anime stories', false);
      const afterCreation = new Date();

      expect(genre.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(genre.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
      expect(genre.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(genre.updatedAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('should throw error when description is not a string', () => {
      expect(() => Genre.create('Thriller', 123 as any, true)).toThrow(
        'Description must be a string',
      );
    });

    it('should throw error when description is empty or whitespace', () => {
      expect(() => Genre.create('Horror', '', true)).toThrow(
        'Description must be at least 10 characters long',
      );
      expect(() => Genre.create('Fantasy', '   ', false)).toThrow(
        'Description must be at least 10 characters long',
      );
    });

    it('should throw error when description is less than 10 characters', () => {
      expect(() => Genre.create('Sci-Fi', 'Too short', false)).toThrow(
        'Description must be at least 10 characters long',
      );
    });
  });

  describe('getters', () => {
    let genre: Genre;

    beforeEach(() => {
      genre = Genre.create(
        'Slice of Life',
        'Daily life stories with minimal conflict and drama',
        false,
      );
    });

    it('should return id through getter', () => {
      expect(genre.id).toBeInstanceOf(Id);
      expect(typeof genre.id.value).toBe('string');
    });

    it('should return name through getter', () => {
      expect(genre.name.value).toBe('slice of life');
    });

    it('should return description through getter', () => {
      expect(genre.description).toBe('Daily life stories with minimal conflict and drama');
    });

    it('should return isAdultContent through getter', () => {
      expect(genre.isAdultContent).toBe(false);
    });

    it('should return createdAt through getter', () => {
      expect(genre.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt through getter', () => {
      expect(genre.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('immutability', () => {
    it('should not allow modification of properties', () => {
      const genre = Genre.create('Mystery', 'Suspenseful and mysterious storylines', false);

      expect(() => {
        (genre as any).description = 'Modified description';
      }).toThrow();
    });
  });
});
