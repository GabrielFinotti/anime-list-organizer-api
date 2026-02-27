class Name {
  private readonly _value: string;

  private constructor(name: string) {
    this._value = name;
  }

  get value() {
    return this._value;
  }

  static create(name: string, isAnimeName = false) {
    const normalizedName = name.trim();

    this.validateName(normalizedName, isAnimeName);

    return new Name(normalizedName);
  }

  private static validateName(name: string, isAnimeName: boolean) {
    if (isAnimeName && (name.length < 5 || name.length > 100)) {
      throw new Error("Name must be between 5 and 100 characters");
    } else if (!isAnimeName && (name.length < 5 || name.length > 50)) {
      throw new Error("Name must be between 5 and 50 characters");
    }
  }

  equals(other: Name) {
    return this._value === other.value;
  }
}

export default Name;
