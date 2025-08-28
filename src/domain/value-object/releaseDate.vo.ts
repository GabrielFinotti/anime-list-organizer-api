class ReleaseDate {
  private readonly _value: Date;

  private constructor(value: Date | string) {
    this._value = this.normalizeData(value);
  }

  get value() {
    return this._value;
  }

  static create(date: Date | string) {
    return new ReleaseDate(date);
  }

  private normalizeData(value: Date | string) {
    const data = typeof value === "string" ? new Date(value) : value;

    if (isNaN(data.getTime())) throw new Error("Data inválida");

    return data;
  }
}

export default ReleaseDate;
