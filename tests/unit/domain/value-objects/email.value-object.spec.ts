import Email from '../../../../src/domain/value-objects/email.value-object';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create an Email when valid string is provided', () => {
      const email = Email.create('test@example.com');

      expect(email).toBeDefined();
      expect(email.value).toBe('test@example.com');
    });

    it('should throw error when value is not a string', () => {
      expect(() => Email.create(123 as any)).toThrow('email: must be a string');
    });

    it('should throw when value is not in a valid email format', () => {
      expect(() => Email.create('nota-email')).toThrow('email: invalid format');
      expect(() => Email.create('invalid@')).toThrow('email: invalid format');
      expect(() => Email.create('invalid@domain.')).toThrow('email: invalid format');
    });

    it('should trim whitespace and normalize to lowercase', () => {
      // Email value object normalizes the input by trimming and lowercasing
      const email = Email.create('  Test@Example.COM  ');

      expect(email.value).toBe('test@example.com');
    });
  });

  describe('equals', () => {
    it('should return true when emails are exactly equal', () => {
      const a = Email.create('user@example.com');
      const b = Email.create('user@example.com');

      expect(a.equals(b)).toBe(true);
    });

    it('should return true when emails differ only by case', () => {
      const a = Email.create('user@example.com');
      const b = Email.create('User@example.com');

      expect(a.equals(b)).toBe(true);
    });

    it('should return true when comparing same instance', () => {
      const a = Email.create('same@example.com');
      expect(a.equals(a)).toBe(true);
    });
  });
});
