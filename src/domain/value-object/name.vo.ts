class Name {
  private readonly _value: string;

  private constructor(value: string) {
    if (!this.isValidName(value)) {
      throw new Error(
        "Nome inválido: deve ter no máximo 100 caracteres e não pode estar vazio"
      );
    }

    this._value = this.normalizeName(value);
  }

  get value(): string {
    return this._value;
  }

  static create(value: string) {
    return new Name(value);
  }

  private isValidName(value: string) {
    return value.length <= 100 && value.trim().length > 0;
  }

  private normalizeName(value: string) {
    return value.trim();
  }
}

export default Name;
