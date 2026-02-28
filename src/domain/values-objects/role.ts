class Role {
  private readonly _value: string;
  private static readonly VALID_ROLES = ["admin", "user"];

  private constructor(role: string) {
    this._value = role;
  }

  get value() {
    return this._value;
  }

  static create(role: string) {
    const normalizedRole = role.trim().toLowerCase();

    this.validateRole(normalizedRole);

    return new Role(normalizedRole);
  }

  private static validateRole(role: string) {
    if (!this.VALID_ROLES.includes(role)) {
      throw new Error(
        `Invalid role. Valid roles are: ${this.VALID_ROLES.join(", ")}`,
      );
    }
  }

  equals(other: Role) {
    return this._value === other.value;
  }
}

export default Role;
