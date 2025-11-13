import Name from '../../../../src/domain/value-objects/name.value-object';

describe('Name Value Object', () => {
  describe('create', () => {
    it('should create a Name with valid string', () => {
      const name = Name.create('Action');
      expect(name.value).toBe('action');
    });

    it('should normalize to lowercase', () => {
      const name = Name.create('DRAMA');
      expect(name.value).toBe('drama');
    });

    it('should trim whitespace', () => {
      const name = Name.create('  Comedy  ');
      expect(name.value).toBe('comedy');
    });

    it('should throw error when name is empty', () => {
      expect(() => Name.create('')).toThrow(
        'Name must be at least 3 characters long and at most 100 characters long'
      );
    });

    it('should throw error when name is less than 3 characters', () => {
      expect(() => Name.create('ab')).toThrow(
        'Name must be at least 3 characters long and at most 100 characters long'
      );
    });

    it('should throw error when name is more than 100 characters', () => {
      const longName = 'a'.repeat(101);
      expect(() => Name.create(longName)).toThrow(
        'Name must be at least 3 characters long and at most 100 characters long'
      );
    });

    it('should accept name with exactly 3 characters', () => {
      const name = Name.create('cat');
      expect(name.value).toBe('cat');
    });

    it('should accept name with exactly 100 characters', () => {
      const name = Name.create('a'.repeat(100));
      expect(name.value).toBe('a'.repeat(100));
    });

    it('should handle mixed case and whitespace', () => {
      const name = Name.create('  Romance Comedy  ');
      expect(name.value).toBe('romance comedy');
    });
  });

  describe('value getter', () => {
    it('should return the normalized name value', () => {
      const name = Name.create('THRILLER');
      expect(name.value).toBe('thriller');
    });
  });

  describe('equals', () => {
    it('should return true when names are equal', () => {
      const name1 = Name.create('Action');
      const name2 = Name.create('action');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false when names are different', () => {
      const name1 = Name.create('Action');
      const name2 = Name.create('Comedy');
      expect(name1.equals(name2)).toBe(false);
    });
  });
});
