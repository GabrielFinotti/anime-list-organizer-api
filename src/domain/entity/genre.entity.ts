import IGenre from "../interface/genre.interface";
import Description from "../value-object/description.vo";
import Name from "../value-object/name.vo";
import ObjectId from "../value-object/objectId.vo";

class Genre {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string[];

  private constructor(data: IGenre) {
    this._id = ObjectId.create(data.id).value;
    this._name = Name.create(data.name).value;
    this._description = data.description.map(
      (d) => Description.create(d).value
    );
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

  static create(data: IGenre) {
    return new Genre(data);
  }
}

export default Genre;
