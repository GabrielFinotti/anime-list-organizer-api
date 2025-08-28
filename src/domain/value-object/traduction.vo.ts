class Traduction {
  private readonly _value: string;

  private constructor(value: string) {
    if (!this.isValidTraduction(value)) {
      throw new Error(
        "Tradução inválida: deve ter no mínimo 5 caracteres e não pode ser vazia"
      );
    }

    this._value = value;
  }

  get value() {
    return this._value;
  }

  static create(value: string) {
    return new Traduction(value);
  }

  private isValidTraduction(value: string) {
    return value.length >= 5 && value.trim().length > 0;
  }
}

export default Traduction;
