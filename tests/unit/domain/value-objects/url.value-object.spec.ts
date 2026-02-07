import Url from '../../../../src/domain/value-objects/url.value-object';

describe('Url Value Object', () => {
  it('should create a Url when valid string is provided (and trimmed)', () => {
    const url = Url.create('  https://example.com/image.png  ');

    expect(url).toBeDefined();
    expect(url.value).toBe('https://example.com/image.png');
  });

  it('should throw error when value is not a string', () => {
    expect(() => Url.create(123 as any)).toThrow('url: must be a non-empty string');
  });

  it('should throw when value is not a valid URL', () => {
    expect(() => Url.create('nota-url')).toThrow('url: invalid format');
  });

  it('should compare equality by value', () => {
    const a = Url.create('https://example.com/equal.png');
    const b = Url.create('https://example.com/equal.png');

    expect(a.equals(b)).toBe(true);
  });
});
