import Description from "../value-object/description.vo";
import Name from "../value-object/name.vo";
import ObjectId from "../value-object/objectId.vo";

class Genre {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string[];

  private constructor(id: string, name: string, description: string[]) {
    this._id = ObjectId.create(id).value;
    this._name = Name.create(name).value;
    this._description = description.map((d) => Description.create(d).value);
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get description() {
    return [...this._description];
  }

  static create(id: string, name: string, description: string[]) {
    return new Genre(id, name, description);
  }
}

export default Genre;
