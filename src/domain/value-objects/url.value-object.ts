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
      throw new Error('URL must be a non-empty string');
    }

    const normalizedUrl = value.trim();

    this.validateUrl(normalizedUrl);

    return new Url(normalizedUrl);
  }

  private static validateUrl(value: string) {
    try {
      new URL(value);
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  equals(other: Url) {
    return this._value === other._value;
  }
}

export default Url;
