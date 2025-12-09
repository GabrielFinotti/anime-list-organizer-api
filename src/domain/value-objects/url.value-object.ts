import { InvalidValueError, InvalidFormatError } from '../errors/index.js';

class Url {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static create(value: string) {
    if (typeof value !== 'string') {
      throw new InvalidValueError({
        message: 'url: must be a non-empty string',
        field: 'url',
      });
    }

    const normalizedUrl = value.trim();

    this.validateUrl(normalizedUrl);

    return new Url(normalizedUrl);
  }

  private static validateUrl(value: string) {
    try {
      new URL(value);
    } catch {
      throw new InvalidFormatError({
        message: 'url: invalid format',
        field: 'url',
        expectedFormat: 'https://example.com',
      });
    }
  }

  equals(other: Url) {
    return this._value === other._value;
  }
}

export default Url;
