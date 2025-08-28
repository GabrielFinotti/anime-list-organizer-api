class Password {
  private readonly _value: string;
  private static readonly regexPassword =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;

  private constructor(value: string) {
    if (!this.isValidPassword(value)) {
      throw new Error(
        "Senha inválida: deve conter pelo menos uma letra, um número e um caractere especial e ter entre 8 e 20 caracteres."
      );
    }
    
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  static create(value: string): Password {
    return new Password(value);
  }

  private isValidPassword(value: string) {
    return (
      Password.regexPassword.test(value) &&
      value.length >= 8 &&
      value.length <= 20
    );
  }
}

export default Password;
