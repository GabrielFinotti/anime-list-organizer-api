import { InvalidValueError } from '../errors/index.js';

class Name {
  private readonly _name: string;

  private constructor(name: string) {
    this._name = name;
  }

  get value() {
    return this._name;
  }

  static create(name: string) {
    if (typeof name !== 'string') {
      throw new InvalidValueError({
        message: 'name: must be a string',
        field: 'name',
      });
    }

    const normalizedName = name.toLowerCase().trim();

    this.validate(normalizedName);

    return new Name(normalizedName);
  }

  private static validate(name: string) {
    if (name.length < 3 || name.length > 100) {
      throw new InvalidValueError({
        message: 'name: must be between 3 and 100 characters long',
        field: 'name',
        min: 3,
        max: 100,
      });
    }
  }

  equals(other: Name) {
    return this._name === other._name;
  }
}

export default Name;
