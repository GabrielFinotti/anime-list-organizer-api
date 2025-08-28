class Description {
  private readonly _value: string;

  private constructor(value: string) {
    if (!this.isValidDescription(value)) {
      throw new Error(
        "Descrição inválida: deve ter pelo menos 10 caracteres e não pode estar vazia"
      );
    }

    this._value = this.normalizeDescription(value);
  }

  get value(): string {
    return this._value;
  }

  static create(value: string) {
    return new Description(value);
  }

  private isValidDescription(value: string) {
    return value.length >= 10 && value.trim().length > 0;
  }

  private normalizeDescription(value: string) {
    return value.trim();
  }
}

export default Description;
