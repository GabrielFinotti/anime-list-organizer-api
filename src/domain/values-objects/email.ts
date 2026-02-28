class Email {
  private readonly _value: string;
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(email: string) {
    this._value = email;
  }

  get value() {
    return this._value;
  }

  static create(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    this.validateEmail(normalizedEmail);

    return new Email(normalizedEmail);
  }

  private static validateEmail(email: string) {
    if (!this.emailRegex.test(email)) {
      throw new Error("Invalid email format.");
    }
  }
}

export default Email;
