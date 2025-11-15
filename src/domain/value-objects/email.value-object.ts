class Email {
  private readonly _value: string;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static create(email: string) {
    this.validateEmail(email);

    return new Email(email);
  }

  private static validateEmail(email: string) {
    if (typeof email !== 'string') throw new Error('Email must be a string');
    if (!this.EMAIL_REGEX.test(email)) throw new Error('Invalid email format');
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}

export default Email;
