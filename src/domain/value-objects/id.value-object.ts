import { ulid, isValid } from 'ulid';

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
    if (!isValid(id)) throw new Error('ID must be a valid ULID');
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
