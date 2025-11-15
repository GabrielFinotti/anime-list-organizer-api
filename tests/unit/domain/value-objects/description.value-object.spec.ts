import Description from '../../../../src/domain/value-objects/description.value-object';

describe('Description Value Object', () => {
  it('should create a Description when valid string is provided', () => {
    const description = Description.create('Animes with action-packed scenes and battle sequences');

    expect(description).toBeDefined();
    expect(description.value).toBe('Animes with action-packed scenes and battle sequences');
  });

  it('should throw error when value is not a string', () => {
    expect(() => Description.create(123 as any)).toThrow('Description must be a string');
  });

  it('should throw when description is less than 10 characters', () => {
    expect(() => Description.create('Too short')).toThrow(
      'Description must be between 10 and 800 characters',
    );
  });

  it('should throw when description is longer than 800 characters', () => {
    const long = 'a'.repeat(801);
    expect(() => Description.create(long)).toThrow(
      'Description must be between 10 and 800 characters',
    );
  });

  it('should compare equality by value', () => {
    const a = Description.create('Story about a hero');
    const b = Description.create('Story about a hero');

    expect(a.equals(b)).toBe(true);
  });
});
