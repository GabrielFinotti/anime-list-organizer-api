import bcrypt from 'bcrypt';

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
    const normalizedPassword = password.trim();

    this.validatePassword(normalizedPassword);

    const hashedPassword = this.hashPassword(normalizedPassword);

    return new Password(hashedPassword);
  }

  private static validatePassword(password: string) {
    if (typeof password !== 'string') throw new Error('Password must be a string');

    const errorMessages: string[] = [];

    if (password.length < 6 || password.length > 20) {
      errorMessages.push('Password must be between 6 and 20 characters long');
    }

    if (!this.PASSWORD_REGEX.test(password)) {
      errorMessages.push(
        'Password must contain at least one letter, one number, and one special character',
      );
    }

    if (errorMessages.length > 0) {
      throw new Error(errorMessages.join('; '));
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
