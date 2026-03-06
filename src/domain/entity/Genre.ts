import About from "../values-objects/about.js";
import Id from "../values-objects/id.js";
import Name from "../values-objects/name.js";

type GenreProps = {
  id: Id;
  name: Name;
  description: About;
  isAdultGenre: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class Genre {
  private readonly _id: Id;
  private _name: Name;
  private _description: About;
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

  static create(data: {
    name: string;
    description: string;
    isAdultGenre: boolean;
  }) {
    const id = Id.generateRandom();
    const name = Name.create(data.name);
    const description = About.create(data.description);
    const isAdultGenre = data.isAdultGenre;
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Genre({
      id,
      name,
      description,
      isAdultGenre,
      createdAt,
      updatedAt,
    });
  }

  static toDomain(raw: {
    _id: string;
    name: string;
    description: string;
    isAdultGenre: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new Genre({
      id: Id.create(raw._id),
      name: Name.create(raw.name),
      description: About.create(raw.description),
      isAdultGenre: raw.isAdultGenre,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  equals(other: Genre) {
    return this._id.equals(other.id);
  }
}

export default Genre;
