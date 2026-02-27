class PhoneNumber {
  private readonly _value: string;
  private static readonly PHONE_NUMBER_REGEX = /^55\d{9}$/;

  private constructor(phoneNumber: string) {
    this._value = phoneNumber;
  }

  get value() {
    return this._value;
  }

  static create(phoneNumber: string) {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    this.validate(cleanedPhoneNumber);

    return new PhoneNumber(cleanedPhoneNumber);
  }

  private static validate(phoneNumber: string) {
    if (!this.PHONE_NUMBER_REGEX.test(phoneNumber)) {
      throw new Error(
        "Invalid phone number format. Expected format: 55XXXXXXXXX",
      );
    }
  }

  equals(other: PhoneNumber) {
    return this._value === other.value;
  }
}

export default PhoneNumber;
