import { InvalidFormatError, InvalidValueError } from '../errors/index.js';

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
    if (typeof email !== 'string') {
      throw new InvalidValueError({
        message: 'email: must be a string',
        field: 'email',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    this.validateEmail(normalizedEmail);

    return new Email(normalizedEmail);
  }

  private static validateEmail(email: string) {
    if (!this.EMAIL_REGEX.test(email)) {
      throw new InvalidFormatError({
        message: 'email: invalid format',
        field: 'email',
        expectedFormat: 'user@domain.com',
      });
    }
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}

export default Email;
