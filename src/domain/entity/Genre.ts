import Id from "../values-objects/id.js";
import Name from "../values-objects/name.js";

type GenreProps = {
  id: Id;
  name: Name;
  description: string;
  isAdultGenre: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class Genre {
  private readonly _id: Id;
  private _name: Name;
  private _description: string;
  private _isAdultGenre: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: GenreProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._isAdultGenre = props.isAdultGenre;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get isAdultGenre() {
    return this._isAdultGenre;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}

export default Genre;
