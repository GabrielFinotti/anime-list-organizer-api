import Description from '../value-objects/description.value-object.js';
import Id from '../value-objects/id.value-object.js';
import Name from '../value-objects/name.value-object.js';
import { InvalidValueError } from '../errors/index.js';

type GenreProps = {
  id: Id;
  name: Name;
  description: Description;
  isAdultContent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class Genre {
  private readonly _id: Id;
  private readonly _name: Name;
  private readonly _description: Description;
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
    this.validateIsAdultContent(isAdultContent);

    const id = Id.generateRandomId();
    const newName = Name.create(name);
    const newDescription = Description.create(description);
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Genre({
      id,
      name: newName,
      description: newDescription,
      isAdultContent,
      createdAt,
      updatedAt,
    });
  }

  static toDomain(doc: {
    id: string;
    name: string;
    description: string;
    isAdultContent: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new Genre({
      id: Id.create(doc.id),
      name: Name.create(doc.name),
      description: Description.create(doc.description),
      isAdultContent: doc.isAdultContent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private static validateIsAdultContent(value: boolean) {
    if (typeof value !== 'boolean') {
      throw new InvalidValueError({
        message: 'isAdultContent: must be a boolean',
        field: 'isAdultContent',
      });
    }
  }

  equals(other: Genre) {
    return this._id.equals(other.id);
  }
}

export default Genre;
