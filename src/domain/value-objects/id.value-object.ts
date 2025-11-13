import { ulid } from 'ulid';

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
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('ID must be a non-empty string');
    }
  }

  static generateRandomId() {
    const randomId = ulid();

    return new Id(randomId);
  }
}

export default Id;
