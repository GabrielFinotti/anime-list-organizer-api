import Password from '../../../../src/domain/value-objects/password.value-object';

describe('Password Value Object', () => {
  describe('create', () => {
    it('should hash and create a Password when a valid string is provided', () => {
      const plain = 'Abc123!';
      const password = Password.create(plain);

      expect(password).toBeDefined();
      expect(password.value).not.toBe(plain); // hashed value must differ
      expect(password.comparePassword(plain)).toBe(true);
    });

    it('should trim whitespace before validation and hashing', () => {
      const plain = ' Abc123! ';
      const password = Password.create(plain);

      expect(password.comparePassword('Abc123!')).toBe(true);
    });

    it('should throw when value is not a string', () => {
      // create uses trim() before validate and will throw for non-string inputs, so
      // just assert it throws rather than matching an exact message.
      expect(() => Password.create(123 as any)).toThrow();
    });

    it('should throw when password is too short (less than 6)', () => {
      expect(() => Password.create('A1!')).toThrow(
        'password: must be between 6 and 20 characters long',
      );
    });

    it('should throw when password lacks number/letter/special char', () => {
      expect(() => Password.create('abcdefg1')).toThrow(
        'password: must contain at least one letter, one number, and one special character',
      );
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct plain-text password', () => {
      const plain = 'Abc123!';
      const password = Password.create(plain);

      expect(password.comparePassword(plain)).toBe(true);
    });

    it('should return false for wrong plain-text password', () => {
      const password = Password.create('Abc123!');
      expect(password.comparePassword('Wrong123!')).toBe(false);
    });
  });

  describe('equals', () => {
    it('should be true when comparing same object instance', () => {
      const p = Password.create('Abc123!');
      expect(p.equals(p)).toBe(true);
    });

    it('should normally be false for two different hashed passwords even if created from the same plain value', () => {
      // Due to salt, two hashes from the same plain password should be different
      const p1 = Password.create('Abc123!');
      const p2 = Password.create('Abc123!');

      expect(p1.equals(p2)).toBe(false);
    });
  });

  describe('createFromHash', () => {
    it('should create a Password from a hash and compare correctly', () => {
      const plain = 'Abc123!';
      const hashed = Password.create(plain).value;

      const fromHash = Password.createFromHash(hashed);

      expect(fromHash).toBeDefined();
      // equals should be true because they use the same underlying hash
      expect(fromHash.equals(Password.createFromHash(hashed))).toBe(true);
      expect(fromHash.comparePassword(plain)).toBe(true);
    });

    it('should throw when hash is not a string', () => {
      expect(() => Password.createFromHash(123 as any)).toThrow('hashedPassword: must be a string');
    });
  });
});
