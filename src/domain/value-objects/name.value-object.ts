class Name {
  private readonly _name: string;

  private constructor(name: string) {
    this._name = name;
  }

  get value() {
    return this._name;
  }

  static create(name: string) {
    const nomralizedName = name.toLowerCase().trim();

    this.validate(nomralizedName);

    return new Name(nomralizedName);
  }

  private static validate(name: string) {
    if (typeof name !== 'string') throw new Error('Name must be a string');

    if (name.length < 3 || name.length > 100) {
      throw new Error('Name must be at least 3 characters long and at most 100 characters long');
    }
  }

  equals(other: Name) {
    return this._name === other._name;
  }
}

export default Name;
