import { InvalidValueError } from '../errors/index.js';

class Description {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static create(description: string): Description {
    if (typeof description !== 'string') {
      throw new InvalidValueError({
        message: 'description: must be a string',
        field: 'description',
      });
    }

    const normalizedDescription = description.trim();

    this.validateDescription(normalizedDescription);

    return new Description(normalizedDescription);
  }

  private static validateDescription(description: string) {
    if (description.length < 10 || description.length > 800) {
      throw new InvalidValueError({
        message: 'description: must be between 10 and 800 characters',
        field: 'description',
        min: 10,
        max: 800,
      });
    }
  }

  equals(other: Description): boolean {
    return this._value === other.value;
  }
}

export default Description;
