class ObjectId {
  private readonly _value: string;
  private static readonly regexId = /^[0-9a-fA-F]{24}$/;

  private constructor(objectId: string) {
    if (!this.validateId(objectId)) {
      throw new Error("ObjectId inválido: deve ter 24 caracteres hexadecimais");
    }

    this._value = objectId;
  }

  get value() {
    return this._value;
  }

  static create<T>(value: T) {
    const objectId = String(value);

    return new ObjectId(objectId);
  }

  private validateId(objectId: string) {
    return ObjectId.regexId.test(objectId);
  }
}

export default ObjectId;
