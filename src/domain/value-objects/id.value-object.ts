import { ulid, isValid } from 'ulid';
import { InvalidFormatError } from '../errors/index.js';

class Id {
  private readonly _id: string;

  private constructor(id: string) {
    this._id = id;
  }

  static create(id: string) {
    this.validate(id);

    return new Id(id);
  }

  get value() {
    return this._id;
  }

  private static validate(id: string) {
    if (!isValid(id)) {
      throw new InvalidFormatError({
        message: 'id: must be a valid ULID',
        field: 'id',
        expectedFormat: 'ULID (26 characters)',
      });
    }
  }

  static generateRandomId() {
    const randomId = ulid();

    return new Id(randomId);
  }

  equals(other: Id) {
    return this._id === other._id;
  }
}

export default Id;
