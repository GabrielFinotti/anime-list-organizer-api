import bcrypt from "bcrypt";

class Password {
  private readonly _value: string;
  private static readonly PASSWORD_REGEX =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  private constructor(password: string) {
    this._value = password;
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

  static fromPersistence(hashedPassword: string) {
    return new Password(hashedPassword);
  }

  private static validatePassword(password: string) {
    if (!this.PASSWORD_REGEX.test(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character",
      );
    }

    if (password.length < 8 || password.length > 20) {
      throw new Error("Password must be between 8 and 20 characters long");
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
