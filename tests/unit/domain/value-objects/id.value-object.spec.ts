import { ulid } from 'ulid';
import Id from '../../../../src/domain/value-objects/id.value-object';

describe('Id Value Object', () => {
  describe('create', () => {
    it('should create an Id with a valid ULID string', () => {
      const validId = ulid();
      const id = Id.create(validId);
      expect(id.value).toBe(validId);
    });

    it('should throw error when id is empty string', () => {
      expect(() => Id.create('')).toThrow('id: must be a valid ULID');
    });

    it('should throw error when id is only whitespace', () => {
      expect(() => Id.create('   ')).toThrow('id: must be a valid ULID');
    });

    it('should throw error when id is not a string', () => {
      // Not a string will fail ulid validation
      expect(() => Id.create(123 as any)).toThrow('id: must be a valid ULID');
    });
  });

  describe('generateRandomId', () => {
    it('should generate a random Id', () => {
      const id = Id.generateRandomId();
      expect(id.value).toBeDefined();
      expect(typeof id.value).toBe('string');
    });

    it('should generate different Ids on consecutive calls', () => {
      const id1 = Id.generateRandomId();
      const id2 = Id.generateRandomId();
      expect(id1.value).not.toBe(id2.value);
    });

    it('should generate ULID format (26 characters)', () => {
      const id = Id.generateRandomId();
      expect(id.value.length).toBe(26);
    });

    it('should generate unique and valid ULIDs', () => {
      const id1 = Id.generateRandomId();
      const id2 = Id.generateRandomId();

      expect(id1.value).not.toBe(id2.value);
      expect(id1.value.length).toBe(26);
      expect(id2.value.length).toBe(26);
    });
  });

  describe('value getter', () => {
    it('should return the id value', () => {
      const validId = ulid();
      const id = Id.create(validId);
      expect(id.value).toBe(validId);
    });
  });

  describe('equals', () => {
    it('should return true for equal Id objects', () => {
      const validId = ulid();
      const id1 = Id.create(validId);
      const id2 = Id.create(validId);
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different Id objects', () => {
      const id1 = Id.generateRandomId();
      const id2 = Id.generateRandomId();
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
