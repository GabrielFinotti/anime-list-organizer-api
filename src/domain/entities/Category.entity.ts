import Id from '../value-objects/id.value-object.js';
import Name from '../value-objects/name.value-object.js';

type CategoryProps = {
  id: Id;
  name: Name;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

class Category {
  private readonly _id: Id;
  private readonly _name: Name;
  private readonly _description: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: CategoryProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
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

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(name: string, description: string) {
    if (typeof description !== 'string') throw new Error('Description must be a string');

    const normalizedDescription = description.trim();

    this.validateDescription(normalizedDescription);

    const id = Id.generateRandomId();
    const newName = Name.create(name);
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Category({
      id,
      name: newName,
      description: normalizedDescription,
      createdAt,
      updatedAt,
    });
  }

  private static validateDescription(description: string) {
    if (description.length < 10) throw new Error('Description must be at least 10 characters long');
  }

  equals(other: Category) {
    return this._id.equals(other.id);
  }
}

export default Category;
