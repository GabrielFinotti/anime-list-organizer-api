import bcrypt from 'bcrypt';
import {
  InvalidValueError,
  AggregateValidationError,
  ValidationErrorDetail,
} from '../errors/index.js';

class Password {
  private readonly _value: string;

  private static readonly PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

  private constructor(value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static create(password: string) {
    if (typeof password !== 'string') {
      throw new InvalidValueError({
        message: 'password: must be a string',
        field: 'password',
      });
    }

    const normalizedPassword = password.trim();

    this.validatePassword(normalizedPassword);

    const hashedPassword = this.hashPassword(normalizedPassword);

    return new Password(hashedPassword);
  }

  static createFromHash(hashedPassword: string) {
    if (typeof hashedPassword !== 'string') {
      throw new InvalidValueError({
        message: 'hashedPassword: must be a string',
        field: 'hashedPassword',
      });
    }

    return new Password(hashedPassword);
  }

  private static validatePassword(password: string) {
    const errors: ValidationErrorDetail[] = [];

    if (password.length < 6 || password.length > 20) {
      errors.push({
        field: 'password',
        message: 'must be between 6 and 20 characters long',
        code: 'INVALID_VALUE_PASSWORD_LENGTH',
      });
    }

    if (!this.PASSWORD_REGEX.test(password)) {
      errors.push({
        field: 'password',
        message: 'must contain at least one letter, one number, and one special character',
        code: 'INVALID_FORMAT_PASSWORD_COMPLEXITY',
      });
    }

    if (errors.length > 0) {
      throw new AggregateValidationError(errors);
    }
  }

  private static hashPassword(password: string) {
    const hashedPassword = bcrypt.hashSync(password, 10);

    return hashedPassword;
  }

  comparePassword(plainPassword: string) {
    return bcrypt.compareSync(plainPassword, this._value);
  }

  equals(other: Password) {
    return this._value === other.value;
  }
}

export default Password;
