import Id from '../value-objects/id.value-object.js';
import Name from '../value-objects/name.value-object.js';

type GenreProps = {
  _id: Id;
  name: Name;
  description: string;
  isAdult: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class Genre {
  private readonly _id: Id;
  private readonly _name: Name;
  private readonly _description: string;
  private readonly _isAdult: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: GenreProps) {
    this._id = props._id;
    this._name = props.name;
    this._description = props.description;
    this._isAdult = props.isAdult;
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

  get isAdult() {
    return this._isAdult;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(name: string, description: string, isAdult: boolean) {
    if (typeof description !== 'string') throw new Error('Description must be a string');
    const nomralizedDescription = description.trim();

    this.validateDescription(nomralizedDescription);

    const id = Id.generateRandomId();
    const newName = Name.create(name);
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Genre({
      _id: id,
      name: newName,
      description: nomralizedDescription,
      isAdult,
      createdAt,
      updatedAt,
    });
  }

  private static validateDescription(description: string) {
    if (description.length < 10) throw new Error('Description must be at least 10 characters long');
  }

  equals(other: Genre) {
    return this._id.equals(other.id);
  }
}

export default Genre;