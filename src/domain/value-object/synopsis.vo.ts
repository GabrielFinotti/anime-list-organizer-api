class Synopsis {
  private readonly _value: string;

  private constructor(value: string) {
    if (!this.isValidSynopsis(value)) {
      throw new Error(
        "Sinopse inválida. Deve ter no mínimo 10 caracteres e não pode estar vazia"
      );
    }

    this._value = value.trim();
  }

  get value() {
    return this._value;
  }

  static create(value: string) {
    return new Synopsis(value);
  }

  private isValidSynopsis(value: string) {
    return value.length >= 10 && value.trim().length > 0;
  }
}

export default Synopsis;
