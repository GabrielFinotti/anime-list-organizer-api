class Url {
  private readonly _value: string;

  private constructor(url: string) {
    this._value = url;
  }

  get value() {
    return this._value;
  }

  static create(url: string): Url {
    this.isValidUrl(url);

    return new Url(url);
  }

  private static isValidUrl(url: string) {
    try {
      new URL(url);
    } catch (e) {
      throw new Error("Invalid URL format");
    }
  }

  equals(other: Url) {
    return this._value === other.value;
  }
}

export default Url;
