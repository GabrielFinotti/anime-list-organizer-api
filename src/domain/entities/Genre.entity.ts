import Id from '../value-objects/id.value-object.js';
import Name from '../value-objects/name.value-object.js';

type GenreProps = {
  id: Id;
  name: Name;
  description: string;
  isAdultContent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class Genre {
  private readonly _id: Id;
  private readonly _name: Name;
  private readonly _description: string;
  private readonly _isAdultContent: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: GenreProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._isAdultContent = props.isAdultContent;
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

  get isAdultContent() {
    return this._isAdultContent;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(name: string, description: string, isAdultContent: boolean) {
    if (typeof description !== 'string') throw new Error('Description must be a string');

    const normalizedDescription = description.trim();

    this.validateDescription(normalizedDescription);

    const id = Id.generateRandomId();
    const newName = Name.create(name);
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Genre({
      id,
      name: newName,
      description: normalizedDescription,
      isAdultContent,
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
