import Id from '../../../../src/domain/value-objects/id.value-object';

describe('Id Value Object', () => {
  describe('create', () => {
    it('should create an Id with a valid string', () => {
      const id = Id.create('test-id-123');
      expect(id.value).toBe('test-id-123');
    });

    it('should throw error when id is empty string', () => {
      expect(() => Id.create('')).toThrow('ID must be a non-empty string');
    });

    it('should throw error when id is only whitespace', () => {
      expect(() => Id.create('   ')).toThrow('ID must be a non-empty string');
    });

    it('should throw error when id is not a string', () => {
      expect(() => Id.create(123 as any)).toThrow('ID must be a non-empty string');
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

    it('should generate lexicographically sortable IDs', () => {
      const id1 = Id.generateRandomId();
      const id2 = Id.generateRandomId();
      
      // ULIDs are sortable, so later generated ones should be >= earlier ones
      expect(id2.value >= id1.value).toBe(true);
    });
  });

  describe('value getter', () => {
    it('should return the id value', () => {
      const id = Id.create('my-id');
      expect(id.value).toBe('my-id');
    });
  });
});
