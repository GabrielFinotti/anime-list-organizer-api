import { isValid, ulid } from "ulid";

class Id {
  private readonly _value: string;

  private constructor(id: string) {
    this._value = id;
  }

  get value() {
    return this._value;
  }

  static create(id: string) {
    this.validateId(id);

    return new Id(id);
  }

  static generateRandom() {
    const randomId = ulid();

    return new Id(randomId);
  }

  private static validateId(id: string) {
    if (!isValid(id)) {
      throw new Error("Invalid ID");
    }
  }

  equals(other: Id) {
    return this._value === other.value;
  }
}

export default Id;
