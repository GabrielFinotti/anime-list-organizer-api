class TargetAudience {
  private readonly _value: string;

  private constructor(value: string) {
    if (!this.isValidTargetAudience(value)) {
      throw new Error(
        "Target audience inválido: deve ter mais de 10 caracteres e não pode ser vazio"
      );
    }
    
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static create(value: string) {
    return new TargetAudience(value);
  }

  private isValidTargetAudience(value: string) {
    return value.length > 10 && value.trim().length > 0;
  }
}

export default TargetAudience;
